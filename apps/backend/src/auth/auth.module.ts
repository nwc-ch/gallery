import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { GoogleIdentityService } from './google-identity.service.js';
import { SessionGuard } from './session.guard.js';
import { UsersModule } from '../users/users.module.js';
import { AdminGuard } from './admin.guard.js';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [GoogleIdentityService, SessionGuard, AdminGuard],
  exports: [SessionGuard, AdminGuard],
})
export class AuthModule {}
