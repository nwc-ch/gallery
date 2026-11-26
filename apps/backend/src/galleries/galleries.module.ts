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
import { GalleryAccess } from './gallery-access.entity.js';
import { GalleryAccessService } from './gallery-access.service.js';
import { GalleryCoverService } from './gallery-cover.service.js';
import { GalleryManagementService } from './gallery-management.service.js';
import { Category } from './category.entity.js';
import { CategoriesService } from './categories.service.js';
import { CategoriesController } from './categories.controller.js';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    TypeOrmModule.forFeature([Gallery, GalleryImage, GalleryAccess, Category]),
  ],
  controllers: [
    GalleriesController,
    GalleryImagesController,
    CategoriesController,
  ],
  providers: [
    GalleriesService,
    GalleryImagesService,
    R2Service,
    GalleryAccessService,
    GalleryCoverService,
    GalleryManagementService,
    CategoriesService,
  ],
})
export class GalleriesModule {}
