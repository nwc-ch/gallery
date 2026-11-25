import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module.js';
import { configureApp } from '../src/app.setup.js';
import { GoogleIdentityService } from '../src/auth/google-identity.service.js';
import { DatabaseModule } from '../src/database/database.module.js';
import { UsersModule } from '../src/users/users.module.js';
import { Gallery } from '../src/galleries/gallery.entity.js';
import { UserRole } from '../src/users/user-role.js';
import {
  TestDatabaseModule,
  TestUsersModule,
  testGalleryRepository,
  testUsers,
} from './auth-test.modules.js';

describe('Gallery permissions and validation', () => {
  let app: INestApplication;
  let nonce: string;
  const google = {
    configured: true,
    authorizationUrl: (state: string, value: string) => {
      nonce = value;
      return `https://accounts.google.com/auth?state=${state}`;
    },
    verify: async () => ({
      sub: 'test-user',
      email: 'test@example.invalid',
      name: 'Test User',
      nonce,
    }),
  };

  beforeEach(async () => {
    testUsers.clear();
    vi.clearAllMocks();
    const module = await Test.createTestingModule({ imports: [AppModule] })
      .overrideModule(DatabaseModule)
      .useModule(TestDatabaseModule)
      .overrideModule(UsersModule)
      .useModule(TestUsersModule)
      .overrideProvider(getRepositoryToken(Gallery))
      .useValue(testGalleryRepository)
      .overrideProvider(GoogleIdentityService)
      .useValue(google)
      .compile();
    app = module.createNestApplication();
    configureApp(app);
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  async function login(role = UserRole.User) {
    testUsers.set('test-user', {
      id: 'test-user',
      email: 'test@example.invalid',
      name: 'Test User',
      role,
    });
    const agent = request.agent(app.getHttpServer());
    const start = await agent.get('/api/auth/google').expect(302);
    const state = new URL(start.headers.location).searchParams.get('state');
    await agent
      .get('/api/auth/google/callback')
      .query({ state, code: 'code' })
      .expect(302);
    return agent;
  }

  it('rejects guests', async () => {
    await request(app.getHttpServer())
      .post('/api/galleries')
      .send({ title: 'Test' })
      .expect(401);
    await request(app.getHttpServer()).get('/api/galleries').expect(401);
    expect(testGalleryRepository.save).not.toHaveBeenCalled();
  });

  it('allows users to list but not create galleries, even with a forged role', async () => {
    const agent = await login();
    await agent.get('/api/galleries').expect(200);
    await agent
      .post('/api/galleries')
      .set('X-Requested-With', 'Gallery')
      .send({ title: 'Test', role: 'admin' })
      .expect(403);
    expect(testGalleryRepository.save).not.toHaveBeenCalled();
  });

  it('allows an admin to create a gallery with a trimmed title and server-assigned creator', async () => {
    const agent = await login(UserRole.Admin);
    const response = await agent
      .post('/api/galleries')
      .set('X-Requested-With', 'Gallery')
      .send({ title: '  Sommer  ' })
      .expect(201);
    expect(response.body.title).toBe('Sommer');
    expect(response.body.createdById).toBe('test-user');
    expect(testGalleryRepository.save).toHaveBeenCalledTimes(1);
  });

  it.each([
    {},
    { title: '   ' },
    { title: 123 },
    { title: 'x'.repeat(161) },
    { title: 'Title', createdById: 'other' },
  ])('rejects invalid input %j', async (body) => {
    const agent = await login(UserRole.Admin);
    await agent
      .post('/api/galleries')
      .set('X-Requested-With', 'Gallery')
      .send(body)
      .expect(400);
    expect(testGalleryRepository.save).not.toHaveBeenCalled();
  });

  it('rejects a write without the same-origin request header', async () => {
    const agent = await login(UserRole.Admin);
    await agent.post('/api/galleries').send({ title: 'Test' }).expect(403);
  });

  it('enforces revoked admin permissions in an existing session', async () => {
    const agent = await login(UserRole.Admin);
    testUsers.get('test-user')!.role = UserRole.User;
    const profile = await agent.get('/api/auth/me').expect(200);
    expect(profile.body.role).toBe('user');
    await agent
      .post('/api/galleries')
      .set('X-Requested-With', 'Gallery')
      .send({ title: 'Test' })
      .expect(403);
    expect(testGalleryRepository.save).not.toHaveBeenCalled();
  });
});
