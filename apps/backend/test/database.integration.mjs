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
import { GalleryImage } from '../dist/galleries/gallery-image.entity.js';
import { GalleryImagesService } from '../dist/galleries/gallery-images.service.js';
import sharp from 'sharp';
import { GalleryAccess } from '../dist/galleries/gallery-access.entity.js';
import { GalleryAccessService } from '../dist/galleries/gallery-access.service.js';
import { GalleryCoverService } from '../dist/galleries/gallery-cover.service.js';

await test('MariaDB: migrated schema matches entities and Google profiles are persisted without duplicates', async () => {
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
      new GalleryAccessService(runner.manager.getRepository(GalleryAccess)),
    );
    const gallery = await galleries.create('Meine Galerie', id);
    const stored = await runner.manager
      .getRepository(Gallery)
      .findOneByOrFail({ id: gallery.id });
    assert.equal(stored.title, 'Meine Galerie');
    assert.equal(stored.createdById, id);
    const objects = new Map();
    const imageService = new GalleryImagesService(
      runner.manager.getRepository(GalleryImage),
      galleries,
      {
        configured: true,
        put: async (key, buffer) => {
          objects.set(key, buffer);
        },
        remove: async (key) => {
          objects.delete(key);
        },
      },
    );
    const jpg = await sharp({
      create: { width: 30, height: 20, channels: 3, background: 'blue' },
    })
      .jpeg()
      .toBuffer();
    const image = await imageService.upload(gallery.id, {
      buffer: jpg,
      size: jpg.length,
      originalname: 'integration.jpg',
      mimetype: 'image/jpeg',
    });
    const imageRow = await runner.manager
      .getRepository(GalleryImage)
      .findOneByOrFail({ id: image.id, galleryId: gallery.id });
    assert.equal(imageRow.width, 30);
    assert.equal(imageRow.height, 20);
    assert.deepEqual(objects.get(imageRow.originalKey), jpg);
    assert.ok(objects.has(imageRow.previewKey));
    const covers = new GalleryCoverService(
      runner.manager.getRepository(Gallery),
      runner.manager.getRepository(GalleryImage),
    );
    const crop = { x: 0.25, y: 0.25, width: 0.5, height: 0.5 };
    await covers.set(gallery.id, { imageId: image.id, crop });
    const covered = await runner.manager
      .getRepository(Gallery)
      .findOneByOrFail({ id: gallery.id });
    assert.equal(covered.coverImageId, image.id);
    assert.deepEqual(covered.coverCrop, crop);
    const otherAlbum = await galleries.create('Anderes Album', id);
    await assert.rejects(
      covers.set(otherAlbum.id, { imageId: image.id, crop }),
    );
    const admin = { ...changed, role: UserRole.Admin };
    assert.equal(
      (await imageService.list(gallery.id, admin)).images[0].id,
      image.id,
    );
    const viewerProfile = {
      id: `viewer-${randomUUID()}`,
      email: 'viewer@example.invalid',
      name: 'Viewer',
    };
    const viewer = await users.saveGoogleUser(viewerProfile);
    const access = new GalleryAccessService(
      runner.manager.getRepository(GalleryAccess),
    );
    assert.equal(
      (await galleries.list(viewer)).some((item) => item.id === gallery.id),
      false,
    );
    await assert.rejects(galleries.findVisible(gallery.id, viewer));
    await assert.rejects(imageService.list(gallery.id, viewer));
    await access.replace(gallery.id, [viewer.id]);
    assert.equal(
      (await galleries.list(viewer)).some((item) => item.id === gallery.id),
      true,
    );
    assert.equal(
      (await galleries.findVisible(gallery.id, viewer)).id,
      gallery.id,
    );
    assert.equal(
      (await imageService.list(gallery.id, viewer)).images[0].id,
      image.id,
    );
    await assert.rejects(access.replace(gallery.id, ['not-a-registered-user']));
    assert.deepEqual(await access.userIds(gallery.id), [viewer.id]);
    await access.replace(gallery.id, []);
    await assert.rejects(galleries.findVisible(gallery.id, viewer));
    assert.equal(
      (await galleries.list(viewer)).some((item) => item.id === gallery.id),
      false,
    );
    assert.equal(
      (await galleries.findVisible(gallery.id, admin)).id,
      gallery.id,
    );
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

await test('NestJS connects to MariaDB and provides the user repository', async () => {
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
