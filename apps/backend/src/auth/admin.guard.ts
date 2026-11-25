import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import type { Request } from 'express';
import { UserRole } from '../users/user-role.js';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    if (request.session.user?.role !== UserRole.Admin) {
      throw new ForbiddenException(
        'Nur Administratoren dürfen Galerien anlegen.',
      );
    }
    return true;
  }
}
