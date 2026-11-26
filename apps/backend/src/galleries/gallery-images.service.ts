import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'node:crypto';
import { basename } from 'node:path';
import sharp from 'sharp';
import { GalleryImage } from './gallery-image.entity.js';
import { GalleryImageDto, GalleryImagesDto } from './gallery-image.dto.js';
import { GalleriesService } from './galleries.service.js';
import { R2Service } from '../storage/r2.service.js';
import type { AuthUser } from '../auth/auth.types.js';
import { Gallery } from './gallery.entity.js';

export const MAX_IMAGE_BYTES = 50 * 1024 * 1024;

@Injectable()
export class GalleryImagesService {
  private readonly logger = new Logger(GalleryImagesService.name);
  constructor(
    @InjectRepository(GalleryImage)
    private readonly images: Repository<GalleryImage>,
    private readonly galleries: GalleriesService,
    private readonly storage: R2Service,
  ) {}

  private dto(image: GalleryImage): GalleryImageDto {
    const base = `/api/galleries/${image.galleryId}/images/${image.id}`;
    return {
      id: image.id,
      filename: image.filename,
      width: image.width,
      height: image.height,
      byteSize: image.byteSize,
      createdAt: image.createdAt,
      previewUrl: `${base}/preview`,
      originalUrl: `${base}/original`,
    };
  }

  async list(galleryId: string, user: AuthUser): Promise<GalleryImagesDto> {
    await this.galleries.findVisible(galleryId, user);
    const images = await this.images.find({
      where: { galleryId },
      order: { createdAt: 'ASC', id: 'ASC' },
    });
    return {
      images: images.map((image) => this.dto(image)),
      uploadAvailable: this.storage.configured,
    };
  }

  async upload(
    galleryId: string,
    file?: Express.Multer.File,
  ): Promise<GalleryImageDto> {
    await this.galleries.findOne(galleryId);
    if (!file || !file.buffer.length)
      throw new BadRequestException('Bitte eine JPG-Datei auswählen.');
    if (file.size > MAX_IMAGE_BYTES || file.buffer.length > MAX_IMAGE_BYTES)
      throw new BadRequestException(
        'JPG-Dateien dürfen höchstens 50 MiB groß sein.',
      );
    if (!/\.jpe?g$/i.test(file.originalname) || file.mimetype !== 'image/jpeg')
      throw new BadRequestException('Es sind nur JPG-Dateien erlaubt.');
    let width: number;
    let height: number;
    let preview: Buffer;
    try {
      const image = sharp(file.buffer, {
        limitInputPixels: 100_000_000,
        failOn: 'warning',
      });
      const metadata = await image.metadata();
      if (metadata.format !== 'jpeg' || !metadata.width || !metadata.height)
        throw new Error('Not JPEG');
      const rotated =
        metadata.orientation &&
        metadata.orientation >= 5 &&
        metadata.orientation <= 8;
      width = rotated ? metadata.height : metadata.width;
      height = rotated ? metadata.width : metadata.height;
      preview = await image
        .rotate()
        .resize({
          width: 1200,
          height: 1200,
          fit: 'inside',
          withoutEnlargement: true,
        })
        .jpeg({ quality: 82, progressive: true })
        .toBuffer();
    } catch {
      throw new BadRequestException(
        'Die Datei ist kein lesbares JPG-Bild (maximal 100 Megapixel).',
      );
    }
    if (!this.storage.configured)
      throw new ServiceUnavailableException(
        'Der Bildspeicher ist noch nicht konfiguriert.',
      );
    const id = randomUUID();
    const originalKey = `galleries/${galleryId}/${id}/original.jpg`;
    const previewKey = `galleries/${galleryId}/${id}/preview.jpg`;
    let storageStarted = false;
    try {
      const saved = await this.images.manager.transaction(async (manager) => {
        const gallery = await manager.getRepository(Gallery).findOne({
          where: { id: galleryId },
          lock: { mode: 'pessimistic_write' },
        });
        if (!gallery)
          throw new NotFoundException('Album wurde inzwischen gelöscht.');
        storageStarted = true;
        await this.storage.put(originalKey, file.buffer);
        await this.storage.put(previewKey, preview);
        const images = manager.getRepository(GalleryImage);
        return images.save(
          images.create({
            id,
            galleryId,
            filename: basename(file.originalname.replaceAll('\\', '/')).slice(
              -255,
            ),
            originalKey,
            previewKey,
            width,
            height,
            byteSize: file.buffer.length,
          }),
        );
      });
      return this.dto(saved);
    } catch (error) {
      if (storageStarted) {
        const cleanup = await Promise.allSettled([
          this.storage.remove(originalKey),
          this.storage.remove(previewKey),
        ]);
        if (cleanup.some((result) => result.status === 'rejected'))
          this.logger.error(`R2-Aufräumen für Bild ${id} fehlgeschlagen.`);
      }
      if (error instanceof NotFoundException) throw error;
      throw new ServiceUnavailableException(
        'Das Bild konnte nicht gespeichert werden. Bitte erneut versuchen.',
      );
    }
  }

  async remove(galleryId: string, imageId: string): Promise<void> {
    await this.images.manager.transaction(async (manager) => {
      const galleries = manager.getRepository(Gallery);
      const gallery = await galleries.findOne({
        where: { id: galleryId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!gallery) throw new NotFoundException('Album nicht gefunden.');
      const images = manager.getRepository(GalleryImage);
      const image = await images.findOneBy({ id: imageId, galleryId });
      if (!image) throw new NotFoundException('Bild nicht gefunden.');
      // Delete only this image's objects; keep metadata if either deletion fails.
      const prefix = `galleries/${galleryId}/${imageId}/`;
      if (
        image.originalKey !== `${prefix}original.jpg` ||
        image.previewKey !== `${prefix}preview.jpg`
      ) {
        throw new ServiceUnavailableException(
          'Die Bildzuordnung im Speicher ist ungültig.',
        );
      }
      try {
        await this.storage.remove(image.originalKey);
        await this.storage.remove(image.previewKey);
      } catch {
        throw new ServiceUnavailableException(
          'Das Bild konnte nicht vollständig aus R2 gelöscht werden. Bitte das Löschen erneut versuchen.',
        );
      }
      await galleries.update(
        { id: galleryId, coverImageId: imageId },
        { coverImageId: null, coverCrop: null },
      );
      await images.delete({ id: imageId, galleryId });
    });
  }

  async read(
    galleryId: string,
    imageId: string,
    version: 'preview' | 'original',
    user: AuthUser,
  ) {
    await this.galleries.findVisible(galleryId, user);
    const image = await this.images.findOneBy({ id: imageId, galleryId });
    if (!image) throw new NotFoundException('Bild nicht gefunden.');
    return this.storage.get(
      version === 'preview' ? image.previewKey : image.originalKey,
    );
  }
}
