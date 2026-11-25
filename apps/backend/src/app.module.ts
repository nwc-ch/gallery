import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { DatabaseModule } from './database/database.module.js';
import { GalleriesModule } from './galleries/galleries.module.js';
import { FrontendModule } from './frontend/frontend.module.js';

@Module({
  imports: [DatabaseModule, AuthModule, GalleriesModule, FrontendModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
