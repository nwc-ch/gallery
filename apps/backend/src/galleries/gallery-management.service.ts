import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Gallery } from './gallery.entity.js';
import { GalleryImage } from './gallery-image.entity.js';
import { GalleryAccess } from './gallery-access.entity.js';
import { R2Service } from '../storage/r2.service.js';

@Injectable()
export class GalleryManagementService {
  constructor(
    @InjectRepository(Gallery) private readonly galleries: Repository<Gallery>,
    private readonly storage: R2Service,
  ) {}

  async rename(id: string, title: string): Promise<Gallery> {
    return this.galleries.manager.transaction(async (manager) => {
      const galleries = manager.getRepository(Gallery);
      const gallery = await galleries.findOne({
        where: { id },
        lock: { mode: 'pessimistic_write' },
      });
      if (!gallery) throw new NotFoundException('Album nicht gefunden.');
      await galleries.update({ id }, { title });
      gallery.title = title;
      return gallery;
    });
  }

  async remove(id: string): Promise<void> {
    await this.galleries.manager.transaction(async (manager) => {
      const galleries = manager.getRepository(Gallery);
      const gallery = await galleries.findOne({
        where: { id },
        lock: { mode: 'pessimistic_write' },
      });
      if (!gallery) throw new NotFoundException('Album nicht gefunden.');
      const images = manager.getRepository(GalleryImage);
      // The same album lock is held by uploads while writing objects and image records.
      if (
        this.storage.configured ||
        (await images.countBy({ galleryId: id }))
      ) {
        await this.storage.removeAlbumObjects(id);
      }
      // Resolve the cover/image foreign-key cycle before removing the image records.
      await galleries.update({ id }, { coverImageId: null, coverCrop: null });
      await images.delete({ galleryId: id });
      await manager.getRepository(GalleryAccess).delete({ galleryId: id });
      await galleries.delete({ id });
    });
  }
}
