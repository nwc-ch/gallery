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
import { GalleryImage } from '../src/galleries/gallery-image.entity.js';
import { testImageRepository } from './auth-test.modules.js';
import { R2Service } from '../src/storage/r2.service.js';
import sharp from 'sharp';
import { Readable } from 'node:stream';
import { GalleryAccess } from '../src/galleries/gallery-access.entity.js';
import { testAccessRepository, testAlbumAccess } from './auth-test.modules.js';
import {
  TestDatabaseModule,
  TestUsersModule,
  testGalleryRepository,
  testUsers,
} from './auth-test.modules.js';

describe('Gallery permissions and validation', () => {
  let app: INestApplication;
  let nonce: string;
  let googleSubject = 'test-user';
  const galleryId = '35c499c6-f354-41ec-92f7-9d7f437bc0fd';
  const imageId = '182eac0a-bf3c-4a69-ab0e-57cbcb411373';
  const objects = new Map<string, Buffer>();
  const storage = {
    configured: true,
    put: vi.fn(),
    remove: vi.fn(),
    get: vi.fn(),
    removeAlbumObjects: vi.fn(),
  };
  const google = {
    configured: true,
    authorizationUrl: (state: string, value: string) => {
      nonce = value;
      return `https://accounts.google.com/auth?state=${state}`;
    },
    verify: async () => ({
      sub: googleSubject,
      email: 'test@example.invalid',
      name: 'Test User',
      nonce,
    }),
  };

  beforeEach(async () => {
    testUsers.clear();
    testAlbumAccess.clear();
    vi.clearAllMocks();
    testGalleryRepository.find.mockReset().mockResolvedValue([]);
    testGalleryRepository.update.mockReset().mockResolvedValue({ affected: 1 });
    objects.clear();
    storage.configured = true;
    storage.removeAlbumObjects
      .mockReset()
      .mockImplementation(async (id: string) => {
        for (const key of objects.keys())
          if (key.startsWith(`galleries/${id}/`)) objects.delete(key);
      });
    testImageRepository.countBy.mockReset().mockResolvedValue(0);
    storage.put
      .mockReset()
      .mockImplementation(async (key: string, data: Buffer) => {
        objects.set(key, data);
      });
    storage.remove.mockReset().mockImplementation(async (key: string) => {
      objects.delete(key);
    });
    storage.get.mockReset().mockImplementation(async (key: string) => ({
      stream: Readable.from(objects.get(key) ?? Buffer.from('jpg')),
      length: objects.get(key)?.length,
    }));
    testImageRepository.find.mockReset().mockResolvedValue([]);
    testImageRepository.findOneBy.mockReset().mockResolvedValue(null);
    testImageRepository.save
      .mockReset()
      .mockImplementation(async (data: object) => ({
        ...data,
        createdAt: new Date(),
      }));
    testGalleryRepository.findOneBy
      .mockReset()
      .mockImplementation(async ({ id }: { id: string }) => ({
        id,
        title: 'Testgalerie',
      }));
    const module = await Test.createTestingModule({ imports: [AppModule] })
      .overrideModule(DatabaseModule)
      .useModule(TestDatabaseModule)
      .overrideModule(UsersModule)
      .useModule(TestUsersModule)
      .overrideProvider(getRepositoryToken(Gallery))
      .useValue(testGalleryRepository)
      .overrideProvider(getRepositoryToken(GalleryImage))
      .useValue(testImageRepository)
      .overrideProvider(getRepositoryToken(GalleryAccess))
      .useValue(testAccessRepository)
      .overrideProvider(R2Service)
      .useValue(storage)
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

  async function login(role = UserRole.User, userId = 'test-user') {
    googleSubject = userId;
    testUsers.set(userId, {
      id: userId,
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

  it('rejects guest and regular-user uploads before storing anything', async () => {
    await request(app.getHttpServer())
      .post(`/api/galleries/${galleryId}/images`)
      .expect(401);
    const agent = await login();
    await agent
      .post(`/api/galleries/${galleryId}/images`)
      .set('X-Requested-With', 'Gallery')
      .expect(403);
    expect(storage.put).not.toHaveBeenCalled();
  });

  it('requires the same-origin header for uploads', async () => {
    const agent = await login(UserRole.Admin);
    await agent.post(`/api/galleries/${galleryId}/images`).expect(403);
    expect(storage.put).not.toHaveBeenCalled();
  });

  it('stores the unchanged JPG original and an oriented, resized preview', async () => {
    const agent = await login(UserRole.Admin);
    const original = await sharp({
      create: { width: 1800, height: 1200, channels: 3, background: '#687c59' },
    })
      .jpeg()
      .withMetadata({ orientation: 6 })
      .toBuffer();
    const response = await agent
      .post(`/api/galleries/${galleryId}/images`)
      .set('X-Requested-With', 'Gallery')
      .attach('file', original, {
        filename: 'photo.jpg',
        contentType: 'image/jpeg',
      })
      .expect(201);
    expect(response.body.width).toBe(1200);
    expect(response.body.height).toBe(1800);
    expect(response.body.previewUrl).toContain('/preview');
    expect(response.body.originalUrl).toContain('/original');
    expect(response.body.originalKey).toBeUndefined();
    expect(storage.put).toHaveBeenCalledTimes(2);
    const entries = [...objects.entries()];
    expect(entries.find(([key]) => key.endsWith('/original.jpg'))![1]).toEqual(
      original,
    );
    const preview = entries.find(([key]) => key.endsWith('/preview.jpg'))![1];
    const metadata = await sharp(preview).metadata();
    expect(metadata.width).toBe(800);
    expect(metadata.height).toBe(1200);
    expect(metadata.orientation).toBeUndefined();
    expect(metadata.exif).toBeUndefined();
  });

  it('rejects a disguised PNG and corrupt JPG without writing objects', async () => {
    const agent = await login(UserRole.Admin);
    const png = await sharp({
      create: { width: 2, height: 2, channels: 3, background: 'red' },
    })
      .png()
      .toBuffer();
    for (const buffer of [png, Buffer.from('not a JPEG')]) {
      await agent
        .post(`/api/galleries/${galleryId}/images`)
        .set('X-Requested-With', 'Gallery')
        .attach('file', buffer, {
          filename: 'fake.jpg',
          contentType: 'image/jpeg',
        })
        .expect(400);
    }
    expect(storage.put).not.toHaveBeenCalled();
    expect(testImageRepository.save).not.toHaveBeenCalled();
  });

  it('rejects a missing file or wrong extension', async () => {
    const agent = await login(UserRole.Admin);
    await agent
      .post(`/api/galleries/${galleryId}/images`)
      .set('X-Requested-With', 'Gallery')
      .expect(400);
    await agent
      .post(`/api/galleries/${galleryId}/images`)
      .set('X-Requested-With', 'Gallery')
      .attach('file', Buffer.from('data'), {
        filename: 'file.txt',
        contentType: 'image/jpeg',
      })
      .expect(400);
    expect(storage.put).not.toHaveBeenCalled();
  });

  it('removes uploaded objects if the database save fails', async () => {
    const agent = await login(UserRole.Admin);
    const jpg = await sharp({
      create: { width: 3, height: 2, channels: 3, background: 'red' },
    })
      .jpeg()
      .toBuffer();
    testImageRepository.save.mockRejectedValueOnce(new Error('DB unavailable'));
    await agent
      .post(`/api/galleries/${galleryId}/images`)
      .set('X-Requested-With', 'Gallery')
      .attach('file', jpg, { filename: 'photo.jpg', contentType: 'image/jpeg' })
      .expect(503);
    expect(storage.remove).toHaveBeenCalledTimes(2);
    expect(objects.size).toBe(0);
  });

  it('cleans up if storing the preview fails and does not create a database row', async () => {
    const agent = await login(UserRole.Admin);
    const jpg = await sharp({
      create: { width: 3, height: 2, channels: 3, background: 'red' },
    })
      .jpeg()
      .toBuffer();
    storage.put
      .mockImplementationOnce(async (key: string, data: Buffer) => {
        objects.set(key, data);
      })
      .mockRejectedValueOnce(new Error('R2 unavailable'));
    await agent
      .post(`/api/galleries/${galleryId}/images`)
      .set('X-Requested-With', 'Gallery')
      .attach('file', jpg, { filename: 'photo.jpg', contentType: 'image/jpeg' })
      .expect(503);
    expect(objects.size).toBe(0);
    expect(testImageRepository.save).not.toHaveBeenCalled();
  });

  it('does not upload into a missing gallery', async () => {
    const agent = await login(UserRole.Admin);
    testGalleryRepository.findOneBy.mockResolvedValueOnce(null as never);
    await agent
      .post(`/api/galleries/${galleryId}/images`)
      .set('X-Requested-With', 'Gallery')
      .expect(404);
    expect(storage.put).not.toHaveBeenCalled();
  });

  it('protects image reads and prevents access through another gallery ID', async () => {
    await request(app.getHttpServer())
      .get(`/api/galleries/${galleryId}/images/${imageId}/original`)
      .expect(401);
    const agent = await login();
    testAlbumAccess.set(galleryId, new Set(['test-user']));
    await agent
      .get(`/api/galleries/${galleryId}/images/${imageId}/original`)
      .expect(404);
    expect(testImageRepository.findOneBy).toHaveBeenCalledWith({
      id: imageId,
      galleryId,
    });
    expect(storage.get).not.toHaveBeenCalled();
  });

  it('serves preview and original versions from the matching object only', async () => {
    const agent = await login();
    testAlbumAccess.set(galleryId, new Set(['test-user']));
    testImageRepository.findOneBy.mockResolvedValue({
      id: imageId,
      galleryId,
      originalKey: 'original',
      previewKey: 'preview',
    } as never);
    objects.set('original', Buffer.from('original jpg bytes'));
    objects.set('preview', Buffer.from('preview jpg bytes'));
    const preview = await agent
      .get(`/api/galleries/${galleryId}/images/${imageId}/preview`)
      .expect(200)
      .expect('Content-Type', /image\/jpeg/);
    const original = await agent
      .get(`/api/galleries/${galleryId}/images/${imageId}/original`)
      .expect(200);
    expect(preview.body).toEqual(objects.get('preview'));
    expect(original.body).toEqual(objects.get('original'));
    expect(storage.get.mock.calls.map((call) => call[0])).toEqual([
      'preview',
      'original',
    ]);
  });

  it('limits album cover changes to admins and same-origin requests', async () => {
    const body = { imageId, crop: { x: 0, y: 0, width: 1, height: 1 } };
    await request(app.getHttpServer())
      .put(`/api/galleries/${galleryId}/cover`)
      .send(body)
      .expect(401);
    const viewer = await login();
    await viewer
      .put(`/api/galleries/${galleryId}/cover`)
      .set('X-Requested-With', 'Gallery')
      .send(body)
      .expect(403);
    const admin = await login(UserRole.Admin);
    await admin.put(`/api/galleries/${galleryId}/cover`).send(body).expect(403);
    expect(testGalleryRepository.update).not.toHaveBeenCalled();
  });

  it('stores the chosen image and crop without changing the R2 objects', async () => {
    const admin = await login(UserRole.Admin);
    const gallery = {
      id: galleryId,
      title: 'Album',
      coverImageId: null,
      coverCrop: null,
    };
    testGalleryRepository.findOneBy.mockResolvedValue(gallery as never);
    testGalleryRepository.update.mockImplementation(
      async (_criteria: object, patch: object) => {
        Object.assign(gallery, patch);
        return { affected: 1 };
      },
    );
    testImageRepository.findOneBy.mockResolvedValue({
      id: imageId,
      galleryId,
      width: 1800,
      height: 1200,
    } as never);
    const crop = { x: 0.25, y: 0.25, width: 0.5, height: 0.5 };
    const response = await admin
      .put(`/api/galleries/${galleryId}/cover`)
      .set('X-Requested-With', 'Gallery')
      .send({ imageId, crop })
      .expect(200);
    expect(response.body.coverImageId).toBe(imageId);
    expect(response.body.coverCrop).toEqual(crop);
    expect(testImageRepository.findOneBy).toHaveBeenCalledWith({
      id: imageId,
      galleryId,
    });
    expect(storage.put).not.toHaveBeenCalled();
  });

  it('refuses images from other albums', async () => {
    const admin = await login(UserRole.Admin);
    await admin
      .put(`/api/galleries/${galleryId}/cover`)
      .set('X-Requested-With', 'Gallery')
      .send({ imageId, crop: { x: 0, y: 0, width: 1, height: 1 } })
      .expect(404);
    expect(testGalleryRepository.update).not.toHaveBeenCalled();
  });

  it.each([
    { x: 0.75, y: 0, width: 0.5, height: 0.5 },
    { x: 0, y: 0, width: 0.5, height: 1 },
    { x: -1, y: 0, width: 1, height: 1 },
    { x: 0, y: 0, width: 0, height: 0 },
    { x: 0, y: 0, width: '1', height: 1 },
  ])('refuses invalid cover crop %j', async (crop) => {
    const admin = await login(UserRole.Admin);
    testImageRepository.findOneBy.mockResolvedValue({
      id: imageId,
      galleryId,
      width: 1800,
      height: 1200,
    } as never);
    await admin
      .put(`/api/galleries/${galleryId}/cover`)
      .set('X-Requested-With', 'Gallery')
      .send({ imageId, crop })
      .expect(400);
    expect(testGalleryRepository.update).not.toHaveBeenCalled();
  });

  it('rejects a missing crop and additional crop properties', async () => {
    const admin = await login(UserRole.Admin);
    for (const body of [
      { imageId },
      { imageId, crop: { x: 0, y: 0, width: 1, height: 1, role: 'admin' } },
    ]) {
      await admin
        .put(`/api/galleries/${galleryId}/cover`)
        .set('X-Requested-With', 'Gallery')
        .send(body)
        .expect(400);
    }
    expect(testGalleryRepository.update).not.toHaveBeenCalled();
  });

  it('limits renaming and deleting to admins with the same-origin header', async () => {
    await request(app.getHttpServer())
      .patch(`/api/galleries/${galleryId}`)
      .send({ title: 'Neu' })
      .expect(401);
    await request(app.getHttpServer())
      .delete(`/api/galleries/${galleryId}`)
      .expect(401);
    const viewer = await login();
    await viewer
      .patch(`/api/galleries/${galleryId}`)
      .set('X-Requested-With', 'Gallery')
      .send({ title: 'Neu' })
      .expect(403);
    await viewer
      .delete(`/api/galleries/${galleryId}`)
      .set('X-Requested-With', 'Gallery')
      .expect(403);
    const admin = await login(UserRole.Admin);
    await admin
      .patch(`/api/galleries/${galleryId}`)
      .send({ title: 'Neu' })
      .expect(403);
    await admin.delete(`/api/galleries/${galleryId}`).expect(403);
    expect(storage.removeAlbumObjects).not.toHaveBeenCalled();
    expect(testGalleryRepository.delete).not.toHaveBeenCalled();
  });

  it('updates and trims the album title', async () => {
    const admin = await login(UserRole.Admin);
    const response = await admin
      .patch(`/api/galleries/${galleryId}`)
      .set('X-Requested-With', 'Gallery')
      .send({ title: '  Neuer Titel  ' })
      .expect(200);
    expect(response.body.title).toBe('Neuer Titel');
    expect(testGalleryRepository.update).toHaveBeenCalledWith(
      { id: galleryId },
      { title: 'Neuer Titel' },
    );
    expect(storage.removeAlbumObjects).not.toHaveBeenCalled();
  });

  it.each([
    { title: '   ' },
    { title: 'x'.repeat(161) },
    { title: 42 },
    { title: 'Neu', role: 'admin' },
  ])('rejects invalid rename input %j', async (body) => {
    const admin = await login(UserRole.Admin);
    await admin
      .patch(`/api/galleries/${galleryId}`)
      .set('X-Requested-With', 'Gallery')
      .send(body)
      .expect(400);
    expect(testGalleryRepository.update).not.toHaveBeenCalled();
  });

  it('removes all album objects, cover references, images and permissions', async () => {
    const admin = await login(UserRole.Admin);
    objects.set(
      `galleries/${galleryId}/photo/original.jpg`,
      Buffer.from('original'),
    );
    objects.set(
      `galleries/${galleryId}/photo/preview.jpg`,
      Buffer.from('preview'),
    );
    objects.set('galleries/other-album/photo.jpg', Buffer.from('other'));
    await admin
      .delete(`/api/galleries/${galleryId}`)
      .set('X-Requested-With', 'Gallery')
      .expect(204);
    expect(storage.removeAlbumObjects).toHaveBeenCalledExactlyOnceWith(
      galleryId,
    );
    expect(objects.size).toBe(1);
    expect(testGalleryRepository.update).toHaveBeenCalledWith(
      { id: galleryId },
      { coverImageId: null, coverCrop: null },
    );
    expect(testImageRepository.delete).toHaveBeenCalledWith({ galleryId });
    expect(testAccessRepository.delete).toHaveBeenCalledWith({ galleryId });
    expect(testGalleryRepository.delete).toHaveBeenCalledWith({
      id: galleryId,
    });
  });

  it('keeps database records when R2 deletion fails', async () => {
    const admin = await login(UserRole.Admin);
    storage.removeAlbumObjects.mockRejectedValueOnce(
      new (await import('@nestjs/common')).ServiceUnavailableException(
        'R2 unavailable',
      ),
    );
    await admin
      .delete(`/api/galleries/${galleryId}`)
      .set('X-Requested-With', 'Gallery')
      .expect(503);
    expect(testImageRepository.delete).not.toHaveBeenCalled();
    expect(testGalleryRepository.delete).not.toHaveBeenCalled();
    expect(testGalleryRepository.update).not.toHaveBeenCalled();
  });

  it('does not modify R2 for missing albums', async () => {
    const admin = await login(UserRole.Admin);
    testGalleryRepository.findOneBy.mockResolvedValue(null as never);
    await admin
      .delete(`/api/galleries/${galleryId}`)
      .set('X-Requested-With', 'Gallery')
      .expect(404);
    await admin
      .patch(`/api/galleries/${galleryId}`)
      .set('X-Requested-With', 'Gallery')
      .send({ title: 'Neu' })
      .expect(404);
    expect(storage.removeAlbumObjects).not.toHaveBeenCalled();
  });

  it('does not write R2 objects when the album disappeared during image processing', async () => {
    const admin = await login(UserRole.Admin);
    testGalleryRepository.findOneBy
      .mockResolvedValueOnce({ id: galleryId, title: 'Album' })
      .mockResolvedValueOnce(null as never);
    const jpg = await sharp({
      create: { width: 3, height: 2, channels: 3, background: 'red' },
    })
      .jpeg()
      .toBuffer();
    await admin
      .post(`/api/galleries/${galleryId}/images`)
      .set('X-Requested-With', 'Gallery')
      .attach('file', jpg, { filename: 'photo.jpg', contentType: 'image/jpeg' })
      .expect(404);
    expect(storage.put).not.toHaveBeenCalled();
  });

  it('offers registered users and permissions only to admins', async () => {
    const admin = await login(UserRole.Admin, 'admin-user');
    const viewer = await login(UserRole.User, 'viewer-user');
    const response = await admin
      .get(`/api/galleries/${galleryId}/access`)
      .expect(200);
    expect(
      response.body.users.map((user: { id: string }) => user.id).sort(),
    ).toEqual(['admin-user', 'viewer-user']);
    expect(response.body.userIds).toEqual([]);
    await viewer.get(`/api/galleries/${galleryId}/access`).expect(403);
    await viewer
      .put(`/api/galleries/${galleryId}/access`)
      .set('X-Requested-With', 'Gallery')
      .send({ userIds: ['viewer-user'] })
      .expect(403);
    await request(app.getHttpServer())
      .get(`/api/galleries/${galleryId}/access`)
      .expect(401);
  });

  it('requires the same-origin header to change access', async () => {
    const admin = await login(UserRole.Admin);
    await admin
      .put(`/api/galleries/${galleryId}/access`)
      .send({ userIds: [] })
      .expect(403);
    expect(testAccessRepository.manager.transaction).not.toHaveBeenCalled();
  });

  it('keeps unshared albums and all image routes hidden from logged-in users', async () => {
    const viewer = await login();
    testGalleryRepository.find.mockResolvedValue([
      { id: galleryId, title: 'Privat' },
    ]);
    const overview = await viewer.get('/api/galleries').expect(200);
    expect(overview.body).toEqual([]);
    for (const path of [
      `/api/galleries/${galleryId}`,
      `/api/galleries/${galleryId}/images`,
      `/api/galleries/${galleryId}/images/${imageId}/preview`,
      `/api/galleries/${galleryId}/images/${imageId}/original`,
    ]) {
      await viewer.get(path).expect(404);
    }
    expect(storage.get).not.toHaveBeenCalled();
    expect(testImageRepository.findOneBy).not.toHaveBeenCalled();
  });

  it('grants and revokes access per album without requiring the user to log in again', async () => {
    const admin = await login(UserRole.Admin, 'admin-user');
    const viewer = await login(UserRole.User, 'viewer-user');
    const otherGalleryId = '91399920-5ebf-4a0d-b57b-4e964a1b59cf';
    testGalleryRepository.find.mockResolvedValue([
      { id: galleryId, title: 'Geteilt' },
      { id: otherGalleryId, title: 'Privat' },
    ]);
    await admin
      .put(`/api/galleries/${galleryId}/access`)
      .set('X-Requested-With', 'Gallery')
      .send({ userIds: ['viewer-user'] })
      .expect(200);
    const overview = await viewer.get('/api/galleries').expect(200);
    expect(overview.body.map((gallery: { id: string }) => gallery.id)).toEqual([
      galleryId,
    ]);
    await viewer.get(`/api/galleries/${galleryId}`).expect(200);
    await viewer.get(`/api/galleries/${galleryId}/images`).expect(200);
    await viewer.get(`/api/galleries/${otherGalleryId}`).expect(404);
    testImageRepository.findOneBy.mockResolvedValue({
      id: imageId,
      galleryId,
      originalKey: 'original',
      previewKey: 'preview',
    } as never);
    await viewer
      .get(`/api/galleries/${galleryId}/images/${imageId}/original`)
      .expect(200)
      .expect('Cache-Control', 'private, no-store');
    await viewer
      .get(`/api/galleries/${galleryId}/images/${imageId}/preview`)
      .expect(200)
      .expect('Cache-Control', 'private, no-store');
    storage.get.mockClear();
    await admin
      .put(`/api/galleries/${galleryId}/access`)
      .set('X-Requested-With', 'Gallery')
      .send({ userIds: [] })
      .expect(200);
    expect((await viewer.get('/api/galleries').expect(200)).body).toEqual([]);
    for (const path of [
      `/api/galleries/${galleryId}`,
      `/api/galleries/${galleryId}/images`,
      `/api/galleries/${galleryId}/images/${imageId}/preview`,
      `/api/galleries/${galleryId}/images/${imageId}/original`,
    ]) {
      await viewer.get(path).expect(404);
    }
    expect(storage.get).not.toHaveBeenCalled();
    await admin.get(`/api/galleries/${galleryId}`).expect(200);
    expect((await admin.get('/api/galleries').expect(200)).body.length).toBe(2);
  });

  it('refuses unknown users without deleting existing permissions', async () => {
    const admin = await login(UserRole.Admin, 'admin-user');
    await login(UserRole.User, 'viewer-user');
    testAlbumAccess.set(galleryId, new Set(['viewer-user']));
    await admin
      .put(`/api/galleries/${galleryId}/access`)
      .set('X-Requested-With', 'Gallery')
      .send({ userIds: ['unknown-user'] })
      .expect(400);
    expect(testAlbumAccess.get(galleryId)).toEqual(new Set(['viewer-user']));
  });

  it.each([
    { userIds: ['duplicate', 'duplicate'] },
    { userIds: 'user' },
    { userIds: [42] },
    { userIds: [], role: 'admin' },
    {},
  ])('validates access input %j', async (body) => {
    const admin = await login(UserRole.Admin);
    await admin
      .put(`/api/galleries/${galleryId}/access`)
      .set('X-Requested-With', 'Gallery')
      .send(body)
      .expect(400);
    expect(testAccessRepository.manager.transaction).not.toHaveBeenCalled();
  });
});
