import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import type { Request } from 'express';

@Injectable()
export class SameOriginGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    if (
      context.switchToHttp().getRequest<Request>().get('X-Requested-With') !==
      'Gallery'
    ) {
      throw new ForbiddenException();
    }
    return true;
  }
}
