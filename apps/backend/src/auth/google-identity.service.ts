import {
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { CodeChallengeMethod, OAuth2Client } from 'google-auth-library';

@Injectable()
export class GoogleIdentityService {
  get configured(): boolean {
    return Boolean(
      process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
    );
  }

  private client(): OAuth2Client {
    if (!this.configured) {
      throw new ServiceUnavailableException(
        'Google-Anmeldung ist nicht konfiguriert.',
      );
    }
    const origin = process.env.APP_URL ?? 'http://localhost:4200';
    return new OAuth2Client({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      redirectUri: new URL('/api/auth/google/callback', origin).href,
    });
  }

  authorizationUrl(state: string, nonce: string, challenge: string): string {
    return this.client().generateAuthUrl({
      scope: ['openid', 'email', 'profile'],
      state,
      nonce,
      code_challenge: challenge,
      code_challenge_method: CodeChallengeMethod.S256,
      prompt: 'select_account',
    });
  }

  async verify(code: string, verifier: string) {
    const client = this.client();
    const { tokens } = await client.getToken({ code, codeVerifier: verifier });
    if (!tokens.id_token) throw new UnauthorizedException();
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const profile = ticket.getPayload();
    if (!profile?.sub || !profile.email || !profile.email_verified) {
      throw new UnauthorizedException();
    }
    return profile;
  }
}
