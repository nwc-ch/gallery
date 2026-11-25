import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';
import type { INestApplication } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import request from 'supertest';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { frontendOptions } from '../src/frontend/frontend.module.js';
import { AppController } from '../src/app.controller.js';
import { AppService } from '../src/app.service.js';
import { configureApp } from '../src/app.setup.js';

describe('Frontend and API on one origin', () => {
  let app: INestApplication;
  let root: string;

  beforeAll(async () => {
    root = await mkdtemp(join(tmpdir(), 'gallery-frontend-'));
    await writeFile(
      join(root, 'index.html'),
      '<!doctype html><title>Gallery frontend</title><app-root></app-root>',
    );
    await writeFile(join(root, 'main-ABC12345.js'), 'console.log("gallery");');
    @Module({
      imports: [ServeStaticModule.forRoot(...frontendOptions(root))],
      controllers: [AppController],
      providers: [AppService],
    })
    class FrontendFixtureModule {}
    app = await NestFactory.create(FrontendFixtureModule, {
      logger: false,
      abortOnError: false,
    });
    configureApp(app);
    await app.init();
  });

  afterAll(async () => {
    await app?.close();
    if (root) await rm(root, { recursive: true, force: true });
  });

  it.each([
    '/',
    '/login',
    '/dashboard',
    '/galleries/35c499c6-f354-41ec-92f7-9d7f437bc0fd',
  ])('serves the Angular entry point at %s', async (path) => {
    const response = await request(app.getHttpServer())
      .get(path)
      .expect(200)
      .expect('Content-Type', /html/)
      .expect('Cache-Control', 'no-cache');
    expect(response.text).toContain('<app-root>');
  });

  it('serves API routes without the SPA fallback', async () => {
    const response = await request(app.getHttpServer()).get('/api').expect(200);
    expect(response.text).toBe('Hello World!');
    await request(app.getHttpServer())
      .get('/api/does-not-exist')
      .expect(404)
      .expect('Content-Type', /json/);
  });

  it('serves hashed assets with immutable caching and keeps missing files as 404s', async () => {
    await request(app.getHttpServer())
      .get('/main-ABC12345.js')
      .expect(200)
      .expect('Cache-Control', 'public, max-age=31536000, immutable');
    await request(app.getHttpServer()).get('/missing.js').expect(404);
    await request(app.getHttpServer()).get('/.env').expect(404);
  });
});
