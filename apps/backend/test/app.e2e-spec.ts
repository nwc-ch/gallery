import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';
import { configureApp } from './../src/app.setup.js';
import { DatabaseModule } from '../src/database/database.module.js';
import { UsersModule } from '../src/users/users.module.js';
import { TestDatabaseModule, TestUsersModule } from './auth-test.modules.js';
import { testGalleryRepository } from './auth-test.modules.js';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Gallery } from '../src/galleries/gallery.entity.js';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideModule(DatabaseModule)
      .useModule(TestDatabaseModule)
      .overrideProvider(getRepositoryToken(Gallery))
      .useValue(testGalleryRepository)
      .overrideModule(UsersModule)
      .useModule(TestUsersModule)
      .compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();
  });

  it('/api (GET)', () => {
    return request(app.getHttpServer())
      .get('/api')
      .expect(200)
      .expect('Hello World!');
  });

  it('serves the OpenAPI document with the API route and response schema', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/openapi.json')
      .expect(200);

    expect(response.body.info.title).toBe('Gallery API');
    expect(
      response.body.paths['/api'].get.responses['200'].content[
        'application/json'
      ].schema,
    ).toEqual({ type: 'string' });
  });

  it('serves Swagger UI', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/docs/')
      .expect(200);

    expect(response.text).toContain('swagger-ui');
  });

  afterEach(async () => {
    await app.close();
  });
});
