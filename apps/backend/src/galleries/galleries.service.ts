import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Gallery } from './gallery.entity.js';
import { GalleryAccess } from './gallery-access.entity.js';
import { GalleryAccessService } from './gallery-access.service.js';
import type { AuthUser } from '../auth/auth.types.js';
import { UserRole } from '../users/user-role.js';

@Injectable()
export class GalleriesService {
  constructor(
    @InjectRepository(Gallery) private readonly galleries: Repository<Gallery>,
    private readonly access: GalleryAccessService,
  ) {}

  list(user: AuthUser): Promise<Gallery[]> {
    if (user.role !== UserRole.Admin) {
      return this.galleries
        .createQueryBuilder('gallery')
        .innerJoin(
          GalleryAccess,
          'access',
          'access.galleryId = gallery.id AND access.userId = :userId',
          { userId: user.id },
        )
        .orderBy('gallery.title', 'ASC')
        .addOrderBy('gallery.id', 'ASC')
        .getMany();
    }
    return this.galleries.find({ order: { title: 'ASC', id: 'ASC' } });
  }

  async findOne(id: string): Promise<Gallery> {
    const gallery = await this.galleries.findOneBy({ id });
    if (!gallery) throw new NotFoundException('Galerie nicht gefunden.');
    return gallery;
  }

  async findVisible(id: string, user: AuthUser): Promise<Gallery> {
    await this.access.assertCanView(id, user);
    return this.findOne(id);
  }

  create(title: string, createdById: string): Promise<Gallery> {
    return this.galleries.save(this.galleries.create({ title, createdById }));
  }
}
