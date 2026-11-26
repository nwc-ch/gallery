import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, QueryFailedError, Repository } from 'typeorm';
import { Category } from './category.entity.js';
import { Gallery } from './gallery.entity.js';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categories: Repository<Category>,
    @InjectRepository(Gallery) private readonly galleries: Repository<Gallery>,
  ) {}

  list(): Promise<Category[]> {
    return this.categories.find({ order: { name: 'ASC', id: 'ASC' } });
  }

  async create(name: string): Promise<Category> {
    try {
      return await this.categories.save(this.categories.create({ name }));
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        (error.driverError as { code?: string }).code === 'ER_DUP_ENTRY'
      ) {
        throw new ConflictException(
          'Eine Kategorie mit diesem Namen existiert bereits.',
        );
      }
      throw error;
    }
  }

  async replace(galleryId: string, categoryIds: string[]): Promise<Category[]> {
    return this.galleries.manager.transaction(async (manager) => {
      const galleries = manager.getRepository(Gallery);
      const gallery = await galleries.findOne({
        where: { id: galleryId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!gallery) throw new NotFoundException('Album nicht gefunden.');
      const categories = categoryIds.length
        ? await manager.getRepository(Category).findBy({ id: In(categoryIds) })
        : [];
      if (categories.length !== categoryIds.length) {
        throw new BadRequestException(
          'Mindestens eine Kategorie existiert nicht.',
        );
      }
      gallery.categories = categories;
      await galleries.save(gallery);
      return categories;
    });
  }
}
