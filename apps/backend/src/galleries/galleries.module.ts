import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module.js';
import { Gallery } from './gallery.entity.js';
import { GalleriesController } from './galleries.controller.js';
import { GalleriesService } from './galleries.service.js';
import { UsersModule } from '../users/users.module.js';

@Module({
  imports: [AuthModule, UsersModule, TypeOrmModule.forFeature([Gallery])],
  controllers: [GalleriesController],
  providers: [GalleriesService],
})
export class GalleriesModule {}
