import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../users/user-role.js';

export class AuthUser {
  @ApiProperty({ description: 'Stabile Google-Konto-ID' })
  id!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ enum: UserRole })
  role!: UserRole;
}

declare module 'express-session' {
  interface SessionData {
    user?: AuthUser;
    googleLogin?: {
      state: string;
      nonce: string;
      verifier: string;
      createdAt: number;
    };
  }
}
