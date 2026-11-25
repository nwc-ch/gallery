import { Module } from '@nestjs/common';
import { UsersService } from '../src/users/users.service.js';
import type { AuthUser } from '../src/auth/auth.types.js';
import { UserRole } from '../src/users/user-role.js';

export const testUsers = new Map<string, AuthUser>();
export const testGalleryRepository = {
  findOneBy: vi.fn(async ({ id }: { id: string }) => ({
    id,
    title: 'Testgalerie',
  })),
  find: vi.fn(async () => []),
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
      },
    },
  ],
  exports: [UsersService],
})
export class TestUsersModule {}
