import { Module } from '@nestjs/common';
import { UsersService } from '../src/users/users.service.js';
import type { AuthUser } from '../src/auth/auth.types.js';
import { UserRole } from '../src/users/user-role.js';
import { Gallery } from '../src/galleries/gallery.entity.js';
import { User } from '../src/users/user.entity.js';
import { GalleryAccess } from '../src/galleries/gallery-access.entity.js';
import type { FindOperator } from 'typeorm';

export const testUsers = new Map<string, AuthUser>();
export const testAlbumAccess = new Map<string, Set<string>>();
export const testAccessRepository = {
  countBy: vi.fn(
    async ({ galleryId, userId }: { galleryId: string; userId: string }) =>
      testAlbumAccess.get(galleryId)?.has(userId) ? 1 : 0,
  ),
  find: vi.fn(async ({ where }: { where: { galleryId: string } }) =>
    [...(testAlbumAccess.get(where.galleryId) ?? [])].map((userId) => ({
      galleryId: where.galleryId,
      userId,
    })),
  ),
  manager: {
    transaction: vi.fn(async (work: (manager: object) => Promise<unknown>) =>
      work({
        getRepository: (entity: unknown) => {
          if (entity === Gallery)
            return {
              findOne: async ({ where }: { where: { id: string } }) =>
                testGalleryRepository.findOneBy(where),
            };
          if (entity === User)
            return {
              countBy: async ({ id }: { id: FindOperator<string> }) =>
                (id.value as string[]).filter((value) => testUsers.has(value))
                  .length,
            };
          if (entity === GalleryAccess)
            return {
              delete: async ({ galleryId }: { galleryId: string }) => {
                testAlbumAccess.delete(galleryId);
              },
              insert: async (rows: { galleryId: string; userId: string }[]) => {
                for (const row of rows) {
                  if (!testAlbumAccess.has(row.galleryId))
                    testAlbumAccess.set(row.galleryId, new Set());
                  testAlbumAccess.get(row.galleryId)!.add(row.userId);
                }
              },
            };
          throw new Error('Unexpected repository');
        },
      }),
    ),
  },
};

export const testGalleryRepository = {
  update: vi.fn(async (_criteria: object, _data: object) => ({ affected: 1 })),
  createQueryBuilder: vi.fn(() => {
    let userId = '';
    const builder = {
      innerJoin: (
        _entity: unknown,
        _alias: string,
        _condition: string,
        values: { userId: string },
      ) => {
        userId = values.userId;
        return builder;
      },
      orderBy: () => builder,
      addOrderBy: () => builder,
      getMany: async () =>
        (await testGalleryRepository.find()).filter((gallery) =>
          testAlbumAccess.get(gallery.id)?.has(userId),
        ),
    };
    return builder;
  }),
  findOneBy: vi.fn(async ({ id }: { id: string }) => ({
    id,
    title: 'Testgalerie',
  })),
  find: vi.fn(async () => [] as { id: string; title: string }[]),
  create: vi.fn((data: object) => data),
  save: vi.fn(async (data: object) => ({
    id: 'gallery-id',
    ...data,
    createdAt: new Date(),
  })),
};

export const testImageRepository = {
  find: vi.fn(async () => []),
  findOneBy: vi.fn(async () => null),
  create: vi.fn((data: object) => data),
  save: vi.fn(async (data: object) => ({ ...data, createdAt: new Date() })),
};

@Module({})
export class TestDatabaseModule {}

@Module({
  providers: [
    {
      provide: UsersService,
      useValue: {
        saveGoogleUser: async (
          profile: Pick<AuthUser, 'id' | 'email' | 'name'>,
        ) => {
          const user = {
            ...profile,
            role: testUsers.get(profile.id)?.role ?? UserRole.User,
          };
          testUsers.set(user.id, user);
          return user;
        },
        findAuthUser: async (id: string) => testUsers.get(id) ?? null,
        listRegistered: async () => [...testUsers.values()],
      },
    },
  ],
  exports: [UsersService],
})
export class TestUsersModule {}
