import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { GalleryAccess } from './gallery-access.entity.js';
import { Gallery } from './gallery.entity.js';
import { User } from '../users/user.entity.js';
import type { AuthUser } from '../auth/auth.types.js';
import { UserRole } from '../users/user-role.js';

@Injectable()
export class GalleryAccessService {
  constructor(
    @InjectRepository(GalleryAccess)
    private readonly access: Repository<GalleryAccess>,
  ) {}

  async assertCanView(galleryId: string, user: AuthUser): Promise<void> {
    if (user.role === UserRole.Admin) return;
    if ((await this.access.countBy({ galleryId, userId: user.id })) === 0) {
      // Do not reveal whether a non-shared album exists.
      throw new NotFoundException(
        'Album nicht gefunden oder nicht freigegeben.',
      );
    }
  }

  async userIds(galleryId: string): Promise<string[]> {
    const rows = await this.access.find({
      where: { galleryId },
      order: { userId: 'ASC' },
    });
    return rows.map((row) => row.userId);
  }

  async replace(galleryId: string, userIds: string[]): Promise<string[]> {
    return this.access.manager.transaction(async (manager) => {
      const gallery = await manager
        .getRepository(Gallery)
        .findOne({
          where: { id: galleryId },
          lock: { mode: 'pessimistic_write' },
        });
      if (!gallery) throw new NotFoundException('Album nicht gefunden.');
      if (
        userIds.length &&
        (await manager.getRepository(User).countBy({ id: In(userIds) })) !==
          userIds.length
      ) {
        throw new BadRequestException(
          'Es dürfen nur bereits registrierte Benutzer ausgewählt werden.',
        );
      }
      const access = manager.getRepository(GalleryAccess);
      await access.delete({ galleryId });
      if (userIds.length)
        await access.insert(userIds.map((userId) => ({ galleryId, userId })));
      return userIds;
    });
  }
}
