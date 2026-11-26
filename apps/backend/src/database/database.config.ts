import '../config/env.js';
import type { DataSourceOptions } from 'typeorm';
import { fileURLToPath } from 'node:url';
import { User } from '../users/user.entity.js';
import { Gallery } from '../galleries/gallery.entity.js';
import { GalleryImage } from '../galleries/gallery-image.entity.js';
import { GalleryAccess } from '../galleries/gallery-access.entity.js';
import { Category } from '../galleries/category.entity.js';

export function databaseOptions(): DataSourceOptions {
  const port = Number(process.env.DB_PORT ?? 3307);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('DB_PORT muss eine gültige Portnummer sein.');
  }
  if (process.env.NODE_ENV === 'production' && !process.env.DB_PASSWORD) {
    throw new Error('DB_PASSWORD muss für Produktion gesetzt sein.');
  }
  return {
    type: 'mariadb',
    host: process.env.DB_HOST ?? '127.0.0.1',
    port,
    username: process.env.DB_USERNAME ?? 'gallery',
    password: process.env.DB_PASSWORD ?? 'gallery_local',
    database: process.env.DB_DATABASE ?? 'gallery',
    charset: 'utf8mb4',
    timezone: 'Z',
    entities: [User, Gallery, GalleryImage, GalleryAccess, Category],
    migrations: [
      fileURLToPath(new URL('./migrations/*.js', import.meta.url)).replaceAll(
        '\\',
        '/',
      ),
    ],
    migrationsTableName: 'typeorm_migrations',
    synchronize: false,
    migrationsRun: false,
    logging: ['error', 'migration'],
  };
}
