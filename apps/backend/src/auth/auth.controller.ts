import {
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { createHash, randomBytes } from 'node:crypto';
import type { Request, Response } from 'express';
import { AuthUser } from './auth.types.js';
import { GoogleIdentityService } from './google-identity.service.js';
import { SessionGuard } from './session.guard.js';
import { UsersService } from '../users/users.service.js';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly google: GoogleIdentityService,
    private readonly users: UsersService,
  ) {}

  @Get('config')
  @ApiOperation({ summary: 'Verfügbarkeit der Google-Anmeldung' })
  config() {
    return { googleConfigured: this.google.configured };
  }

  @Get('google')
  @ApiOperation({ summary: 'Anmeldung bei Google starten' })
  @ApiResponse({
    status: 302,
    description: 'Weiterleitung zur Google-Kontoauswahl',
  })
  async login(@Req() request: Request, @Res() response: Response) {
    const state = randomBytes(32).toString('base64url');
    const nonce = randomBytes(32).toString('base64url');
    const verifier = randomBytes(32).toString('base64url');
    const challenge = createHash('sha256').update(verifier).digest('base64url');
    const url = this.google.authorizationUrl(state, nonce, challenge);
    request.session.googleLogin = {
      state,
      nonce,
      verifier,
      createdAt: Date.now(),
    };
    await new Promise<void>((resolve, reject) =>
      request.session.save((error) => (error ? reject(error) : resolve())),
    );
    response.redirect(url);
  }

  @Get('google/callback')
  @ApiOperation({ summary: 'Google-Anmeldung abschließen' })
  @ApiResponse({
    status: 302,
    description: 'Weiterleitung zum Dashboard oder zurück zum Login',
  })
  async callback(
    @Req() request: Request,
    @Res() response: Response,
    @Query('code') code?: string,
    @Query('state') state?: string,
    @Query('error') error?: string,
  ) {
    response.setHeader('Cache-Control', 'no-store');
    const transaction = request.session.googleLogin;
    delete request.session.googleLogin;
    // Consume the login transaction before contacting Google, including on errors.
    await new Promise<void>((resolve, reject) =>
      request.session.save((err) => (err ? reject(err) : resolve())),
    );
    if (
      error ||
      !code ||
      !transaction ||
      transaction.state !== state ||
      Date.now() - transaction.createdAt > 10 * 60_000
    ) {
      response.redirect('/login?error=google');
      return;
    }
    try {
      const profile = await this.google.verify(code, transaction.verifier);
      if (profile.nonce !== transaction.nonce) throw new Error('Invalid nonce');
      await new Promise<void>((resolve, reject) =>
        request.session.regenerate((err) => (err ? reject(err) : resolve())),
      );
      request.session.user = await this.users.saveGoogleUser({
        id: profile.sub,
        email: profile.email!,
        name: profile.name ?? profile.email!,
      });
      await new Promise<void>((resolve, reject) =>
        request.session.save((err) => (err ? reject(err) : resolve())),
      );
      response.redirect('/dashboard');
    } catch {
      response.redirect('/login?error=google');
    }
  }

  @Get('me')
  @UseGuards(SessionGuard)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Aktuell angemeldetes Google-Konto abrufen' })
  @ApiOkResponse({ type: AuthUser })
  @ApiUnauthorizedResponse()
  me(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): AuthUser {
    response.setHeader('Cache-Control', 'no-store');
    return request.session.user!;
  }

  @Post('logout')
  @HttpCode(204)
  @ApiOperation({ summary: 'Sitzung beenden' })
  @ApiResponse({ status: 204 })
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    // A custom header cannot be sent cross-origin without a CORS preflight.
    if (request.get('X-Requested-With') !== 'Gallery')
      throw new ForbiddenException();
    await new Promise<void>((resolve, reject) =>
      request.session.destroy((err) => (err ? reject(err) : resolve())),
    );
    response.clearCookie('gallery.sid', {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
  }
}
