import { ApiProperty } from '@nestjs/swagger';

export class AuthUser {
  @ApiProperty({ description: 'Stabile Google-Konto-ID' })
  id!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  name!: string;
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
