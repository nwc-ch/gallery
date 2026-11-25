import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { UsersService } from '../users/users.service.js';

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(private readonly users: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    if (!request.session.user) throw new UnauthorizedException();
    const user = await this.users.findAuthUser(request.session.user.id);
    if (!user) throw new UnauthorizedException();
    request.session.user = user;
    return true;
  }
}
