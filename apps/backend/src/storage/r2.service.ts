import {
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import type { OnModuleDestroy } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  DeleteObjectsCommand,
} from '@aws-sdk/client-s3';
import { Readable } from 'node:stream';

@Injectable()
export class R2Service implements OnModuleDestroy {
  private client?: S3Client;
  readonly bucket = 'gallery';

  get configured(): boolean {
    return Boolean(
      (process.env.R2_ACCOUNT_ID || process.env.R2_ENDPOINT) &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY,
    );
  }

  private connection(): S3Client {
    if (!this.configured)
      throw new ServiceUnavailableException(
        'Der Bildspeicher ist nicht konfiguriert.',
      );
    if (!this.client) {
      const endpoint =
        process.env.R2_ENDPOINT ||
        `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
      if (new URL(endpoint).protocol !== 'https:')
        throw new ServiceUnavailableException(
          'R2 benötigt einen HTTPS-Endpunkt.',
        );
      this.client = new S3Client({
        endpoint,
        region: 'auto',
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID!,
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
        },
        requestChecksumCalculation: 'WHEN_REQUIRED',
        responseChecksumValidation: 'WHEN_REQUIRED',
      });
    }
    return this.client;
  }

  async put(key: string, data: Buffer): Promise<void> {
    await this.connection().send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: data,
        ContentType: 'image/jpeg',
      }),
    );
  }

  async remove(key: string): Promise<void> {
    await this.connection().send(
      new DeleteObjectCommand({ Bucket: this.bucket, Key: key }),
    );
  }

  async removeAlbumObjects(galleryId: string): Promise<void> {
    if (
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        galleryId,
      )
    ) {
      throw new Error('Ungültige Album-ID für die R2-Bereinigung.');
    }
    const prefix = `galleries/${galleryId}/`;
    try {
      const client = this.connection();
      // Always drain the first page: deleting keys must not invalidate a pagination token.
      while (true) {
        const page = await client.send(
          new ListObjectsV2Command({
            Bucket: this.bucket,
            Prefix: prefix,
            MaxKeys: 1000,
          }),
        );
        const keys = (page.Contents ?? [])
          .map((object) => object.Key)
          .filter((key): key is string => typeof key === 'string');
        if (keys.length !== (page.Contents ?? []).length)
          throw new Error('R2 returned invalid object keys');
        if (!keys.length) return;
        if (keys.some((key) => !key.startsWith(prefix)))
          throw new Error('Unexpected object outside album prefix');
        const deleted = await client.send(
          new DeleteObjectsCommand({
            Bucket: this.bucket,
            Delete: { Objects: keys.map((Key) => ({ Key })), Quiet: true },
          }),
        );
        if (deleted.Errors?.length)
          throw new Error('R2 could not delete all objects');
      }
    } catch {
      throw new ServiceUnavailableException(
        'Die Bilder konnten nicht vollständig aus R2 gelöscht werden. Bitte das Löschen erneut versuchen.',
      );
    }
  }

  async get(key: string): Promise<{ stream: Readable; length?: number }> {
    try {
      const object = await this.connection().send(
        new GetObjectCommand({ Bucket: this.bucket, Key: key }),
      );
      if (!(object.Body instanceof Readable)) throw new Error('Empty object');
      return { stream: object.Body, length: object.ContentLength };
    } catch (error) {
      if (error instanceof Error && error.name === 'NoSuchKey')
        throw new NotFoundException('Bild nicht gefunden.');
      if (error instanceof ServiceUnavailableException) throw error;
      throw new ServiceUnavailableException(
        'Das Bild konnte nicht geladen werden.',
      );
    }
  }

  onModuleDestroy(): void {
    this.client?.destroy();
  }
}
