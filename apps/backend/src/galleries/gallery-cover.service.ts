import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Gallery } from './gallery.entity.js';
import { GalleryImage } from './gallery-image.entity.js';
import { SetGalleryCoverDto } from './gallery-cover.dto.js';

@Injectable()
export class GalleryCoverService {
  constructor(
    @InjectRepository(Gallery) private readonly galleries: Repository<Gallery>,
    @InjectRepository(GalleryImage)
    private readonly images: Repository<GalleryImage>,
  ) {}

  async set(galleryId: string, input: SetGalleryCoverDto): Promise<Gallery> {
    const gallery = await this.galleries.findOneBy({ id: galleryId });
    if (!gallery) throw new NotFoundException('Album nicht gefunden.');
    const image = await this.images.findOneBy({ id: input.imageId, galleryId });
    if (!image)
      throw new NotFoundException('Das Bild gehört nicht zu diesem Album.');
    const crop = input.crop;
    if (crop.x + crop.width > 1.000001 || crop.y + crop.height > 1.000001) {
      throw new BadRequestException(
        'Der Ausschnitt muss vollständig im Bild liegen.',
      );
    }
    const aspect = (crop.width * image.width) / (crop.height * image.height);
    if (!Number.isFinite(aspect) || Math.abs(aspect - 1.5) > 0.015) {
      throw new BadRequestException(
        'Das Albumbild benötigt einen Ausschnitt im Format 3:2.',
      );
    }
    await this.galleries.update(
      { id: galleryId },
      {
        coverImageId: image.id,
        coverCrop: {
          x: Math.max(0, Math.min(crop.x, 1 - crop.width)),
          y: Math.max(0, Math.min(crop.y, 1 - crop.height)),
          width: crop.width,
          height: crop.height,
        },
      },
    );
    const updated = await this.galleries.findOneBy({ id: galleryId });
    if (!updated) throw new NotFoundException('Album nicht gefunden.');
    return updated;
  }
}
