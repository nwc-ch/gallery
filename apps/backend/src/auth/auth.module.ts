import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { GoogleIdentityService } from './google-identity.service.js';
import { SessionGuard } from './session.guard.js';

@Module({
  controllers: [AuthController],
  providers: [GoogleIdentityService, SessionGuard],
})
export class AuthModule {}
