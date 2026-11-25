import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { test } from 'node:test';
import dataSource from '../dist/database/data-source.js';
import { User } from '../dist/users/user.entity.js';
import { UsersService } from '../dist/users/users.service.js';
import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { AppModule } from '../dist/app.module.js';
import { UserRole } from '../dist/users/user-role.js';
import { Gallery } from '../dist/galleries/gallery.entity.js';
import { GalleriesService } from '../dist/galleries/galleries.service.js';

test('MariaDB: migrated schema matches entities and Google profiles are persisted without duplicates', async () => {
  await dataSource.initialize();
  const runner = dataSource.createQueryRunner();
  try {
    assert.equal(
      await dataSource.showMigrations(),
      false,
      'Apply pending migrations first',
    );
    const schemaDiff = await dataSource.driver.createSchemaBuilder().log();
    assert.equal(
      schemaDiff.upQueries.length,
      0,
      'Entity changes require a migration',
    );
    await runner.connect();
    await runner.startTransaction();
    const repository = runner.manager.getRepository(User);
    const users = new UsersService(repository);
    const id = `integration-${randomUUID()}`;
    const profile = {
      id,
      email: 'integration@example.invalid',
      name: 'Integration Test',
    };
    assert.deepEqual(await users.saveGoogleUser(profile), {
      ...profile,
      role: 'user',
    });
    const created = await repository.findOneByOrFail({ id });
    assert.ok(created.createdAt instanceof Date);
    assert.ok(created.lastLoginAt instanceof Date);
    const changed = {
      ...profile,
      email: 'changed@example.invalid',
      name: 'Changed Name',
    };
    await repository.update({ id }, { role: UserRole.Admin });
    assert.deepEqual(await users.saveGoogleUser(changed), {
      ...changed,
      role: 'admin',
    });
    const galleries = new GalleriesService(
      runner.manager.getRepository(Gallery),
    );
    const gallery = await galleries.create('Meine Galerie', id);
    const stored = await runner.manager
      .getRepository(Gallery)
      .findOneByOrFail({ id: gallery.id });
    assert.equal(stored.title, 'Meine Galerie');
    assert.equal(stored.createdById, id);
    assert.equal(await repository.countBy({ id }), 1);
    const updated = await repository.findOneByOrFail({ id });
    assert.equal(updated.createdAt.getTime(), created.createdAt.getTime());
    assert.ok(updated.lastLoginAt.getTime() >= created.lastLoginAt.getTime());
  } finally {
    if (runner.isTransactionActive) await runner.rollbackTransaction();
    await runner.release();
    await dataSource.destroy();
  }
});

test('NestJS connects to MariaDB and provides the user repository', async () => {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: false,
  });
  try {
    assert.equal(app.get(DataSource).isInitialized, true);
    assert.ok(app.get(UsersService) instanceof UsersService);
    assert.equal(
      typeof (await app.get(DataSource).getRepository(User).count()),
      'number',
    );
  } finally {
    await app.close();
  }
});
