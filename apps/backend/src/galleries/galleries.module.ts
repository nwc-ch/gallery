import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module.js';
import { Gallery } from './gallery.entity.js';
import { GalleriesController } from './galleries.controller.js';
import { GalleriesService } from './galleries.service.js';
import { UsersModule } from '../users/users.module.js';
import { GalleryImage } from './gallery-image.entity.js';
import { GalleryImagesController } from './gallery-images.controller.js';
import { GalleryImagesService } from './gallery-images.service.js';
import { R2Service } from '../storage/r2.service.js';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    TypeOrmModule.forFeature([Gallery, GalleryImage]),
  ],
  controllers: [GalleriesController, GalleryImagesController],
  providers: [GalleriesService, GalleryImagesService, R2Service],
})
export class GalleriesModule {}
