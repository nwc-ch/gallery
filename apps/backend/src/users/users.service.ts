import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { AuthUser } from '../auth/auth.types.js';
import { User } from './user.entity.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  async saveGoogleUser(
    profile: Pick<AuthUser, 'id' | 'email' | 'name'>,
  ): Promise<AuthUser> {
    await this.users.upsert(
      {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        lastLoginAt: new Date(),
      },
      ['id'],
    );
    const user = await this.users.findOneByOrFail({ id: profile.id });
    return this.toAuthUser(user);
  }

  async findAuthUser(id: string): Promise<AuthUser | null> {
    const user = await this.users.findOneBy({ id });
    return user ? this.toAuthUser(user) : null;
  }

  async listRegistered(): Promise<AuthUser[]> {
    const users = await this.users.find({
      order: { name: 'ASC', email: 'ASC', id: 'ASC' },
    });
    return users.map((user) => this.toAuthUser(user));
  }

  private toAuthUser(user: User): AuthUser {
    return { id: user.id, email: user.email, name: user.name, role: user.role };
  }
}
