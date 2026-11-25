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
