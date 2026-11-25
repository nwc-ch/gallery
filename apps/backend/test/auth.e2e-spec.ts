import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module.js';
import { configureApp } from '../src/app.setup.js';
import { GoogleIdentityService } from '../src/auth/google-identity.service.js';
import { DatabaseModule } from '../src/database/database.module.js';
import { UsersModule } from '../src/users/users.module.js';
import { TestDatabaseModule, TestUsersModule } from './auth-test.modules.js';
import { testGalleryRepository, testUsers } from './auth-test.modules.js';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Gallery } from '../src/galleries/gallery.entity.js';
import { GalleryImage } from '../src/galleries/gallery-image.entity.js';
import { testImageRepository } from './auth-test.modules.js';
import { GalleryAccess } from '../src/galleries/gallery-access.entity.js';
import { testAccessRepository } from './auth-test.modules.js';

describe('Google authentication', () => {
  let app: INestApplication;
  let nonce: string;
  const google = {
    configured: true,
    authorizationUrl: vi.fn(
      (state: string, loginNonce: string, challenge: string) => {
        nonce = loginNonce;
        return `https://accounts.google.com/o/oauth2/v2/auth?state=${state}&code_challenge=${challenge}`;
      },
    ),
    verify: vi.fn(),
  };

  beforeEach(async () => {
    testUsers.clear();
    google.verify.mockReset();
    google.authorizationUrl.mockClear();
    const module = await Test.createTestingModule({ imports: [AppModule] })
      .overrideModule(DatabaseModule)
      .useModule(TestDatabaseModule)
      .overrideProvider(getRepositoryToken(Gallery))
      .useValue(testGalleryRepository)
      .overrideProvider(getRepositoryToken(GalleryImage))
      .useValue(testImageRepository)
      .overrideProvider(getRepositoryToken(GalleryAccess))
      .useValue(testAccessRepository)
      .overrideModule(UsersModule)
      .useModule(TestUsersModule)
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

  async function begin(agent: ReturnType<typeof request.agent>) {
    const response = await agent.get('/api/auth/google').expect(302);
    return new URL(response.headers.location).searchParams.get('state')!;
  }

  it('refuses unauthenticated profile access', async () => {
    await request(app.getHttpServer()).get('/api/auth/me').expect(401);
  });

  it('signs in, preserves the session, and invalidates it on logout', async () => {
    const agent = request.agent(app.getHttpServer());
    const state = await begin(agent);
    google.verify.mockImplementation(async () => ({
      sub: 'google-123',
      email: 'person@example.com',
      name: 'Test Person',
      nonce,
    }));
    const response = await agent
      .get('/api/auth/google/callback')
      .query({ state, code: 'valid-code' })
      .expect(302);
    expect(response.headers.location).toBe('/dashboard');
    expect(response.headers['set-cookie'].join(';')).toContain('HttpOnly');
    expect(response.headers['set-cookie'].join(';')).toContain('SameSite=Lax');
    const profile = await agent.get('/api/auth/me').expect(200);
    expect(profile.body).toEqual({
      id: 'google-123',
      email: 'person@example.com',
      name: 'Test Person',
      role: 'user',
    });
    expect(profile.headers['cache-control']).toBe('no-store');
    await agent
      .post('/api/auth/logout')
      .set('X-Requested-With', 'Gallery')
      .expect(204);
    await agent.get('/api/auth/me').expect(401);
  });

  it('rejects forged state without exchanging the authorization code', async () => {
    const agent = request.agent(app.getHttpServer());
    await begin(agent);
    const response = await agent
      .get('/api/auth/google/callback?state=forged&code=code')
      .expect(302);
    expect(response.headers.location).toBe('/login?error=google');
    expect(google.verify).not.toHaveBeenCalled();
    await agent.get('/api/auth/me').expect(401);
  });

  it('rejects nonce mismatches', async () => {
    const agent = request.agent(app.getHttpServer());
    const state = await begin(agent);
    google.verify.mockResolvedValue({
      sub: 'bad',
      email: 'bad@example.com',
      nonce: 'wrong',
    });
    const response = await agent
      .get('/api/auth/google/callback')
      .query({ state, code: 'code' })
      .expect(302);
    expect(response.headers.location).toBe('/login?error=google');
    await agent.get('/api/auth/me').expect(401);
  });

  it('rejects invalid Google tokens and prevents callback replay', async () => {
    const agent = request.agent(app.getHttpServer());
    const state = await begin(agent);
    google.verify.mockRejectedValue(new Error('Invalid signature'));
    await agent
      .get('/api/auth/google/callback')
      .query({ state, code: 'bad' })
      .expect(302);
    await agent
      .get('/api/auth/google/callback')
      .query({ state, code: 'bad' })
      .expect(302);
    expect(google.verify).toHaveBeenCalledTimes(1);
    await agent.get('/api/auth/me').expect(401);
  });

  it('returns to login when Google access is cancelled', async () => {
    const agent = request.agent(app.getHttpServer());
    const state = await begin(agent);
    const response = await agent
      .get('/api/auth/google/callback')
      .query({ state, error: 'access_denied' })
      .expect(302);
    expect(response.headers.location).toBe('/login?error=google');
    expect(google.verify).not.toHaveBeenCalled();
  });

  it('requires the same-origin request header for logout', async () => {
    await request(app.getHttpServer()).post('/api/auth/logout').expect(403);
  });
});
