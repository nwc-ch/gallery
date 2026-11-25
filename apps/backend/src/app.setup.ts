import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import session from 'express-session';
import { randomBytes } from 'node:crypto';

export function configureApp(app: INestApplication): void {
  const production = process.env.NODE_ENV === 'production';
  const secret = process.env.SESSION_SECRET;
  if (production && (!secret || secret.length < 32)) {
    throw new Error('SESSION_SECRET muss mindestens 32 Zeichen enthalten.');
  }
  if (production && !process.env.APP_URL?.startsWith('https://')) {
    throw new Error('APP_URL muss für Produktion eine HTTPS-URL sein.');
  }
  if (process.env.TRUST_PROXY === '1') {
    app.getHttpAdapter().getInstance().set('trust proxy', 1);
  }
  app.use(
    session({
      name: 'gallery.sid',
      secret: secret || randomBytes(32).toString('hex'),
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: production,
        maxAge: 8 * 60 * 60_000,
      },
    }),
  );
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Gallery API')
    .setDescription('Backend API des Gallery-Projekts')
    .setVersion('1.0.0')
    .addCookieAuth('gallery.sid')
    .build();

  SwaggerModule.setup(
    'api/docs',
    app,
    () => SwaggerModule.createDocument(app, config),
    { jsonDocumentUrl: 'api/openapi.json' },
  );
}
