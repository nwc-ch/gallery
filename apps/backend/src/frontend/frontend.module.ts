import '../config/env.js';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import type { ServeStaticModuleOptions } from '@nestjs/serve-static';
import { existsSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Response } from 'express';

export function frontendOptions(
  rootPath = process.env.FRONTEND_DIST_PATH ??
    fileURLToPath(
      new URL('../../../frontend/dist/frontend/browser', import.meta.url),
    ),
): ServeStaticModuleOptions[] {
  const root = resolve(rootPath);
  if (!existsSync(join(root, 'index.html'))) {
    if (
      process.env.NODE_ENV === 'production' ||
      process.env.FRONTEND_DIST_PATH
    ) {
      throw new Error(
        'Frontend-Build fehlt. Zuerst das Frontend bauen oder FRONTEND_DIST_PATH korrekt setzen.',
      );
    }
    return [];
  }
  return [
    {
      rootPath: root,
      exclude: /^\/api(?:\/|$)/i,
      // Missing assets and API paths must remain 404s instead of returning HTML.
      renderPath: /^(?!\/api(?:\/|$))(?!.*(?:^|\/)\.)(?!.*\.[^/]*$).*/i,
      serveStaticOptions: {
        index: false,
        dotfiles: 'deny',
        redirect: false,
        setHeaders(response: Response, path: string) {
          const file = basename(path);
          const hashedAsset = /-[\w-]{8,}\.(?:js|css)$/.test(file);
          response.setHeader(
            'Cache-Control',
            file === 'index.html'
              ? 'no-cache'
              : hashedAsset
                ? 'public, max-age=31536000, immutable'
                : 'public, max-age=3600',
          );
        },
      },
    },
  ];
}

@Module({
  imports: [
    ServeStaticModule.forRootAsync({ useFactory: () => frontendOptions() }),
  ],
})
export class FrontendModule {}
