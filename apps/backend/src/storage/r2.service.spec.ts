import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Readable } from 'node:stream';
import { R2Service } from './r2.service.js';

describe('Cloudflare R2 storage', () => {
  let storage: R2Service;
  beforeEach(() => {
    vi.stubEnv('R2_ACCOUNT_ID', 'test-account');
    vi.stubEnv('R2_ENDPOINT', '');
    vi.stubEnv('R2_ACCESS_KEY_ID', 'test-key');
    vi.stubEnv('R2_SECRET_ACCESS_KEY', 'test-secret');
    storage = new R2Service();
  });
  afterEach(() => {
    storage.onModuleDestroy();
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it('writes JPEG bytes to the gallery bucket', async () => {
    const send = vi
      .spyOn(S3Client.prototype, 'send')
      .mockResolvedValue({} as never);
    const buffer = Buffer.from('original bytes');
    await storage.put('galleries/test/original.jpg', buffer);
    expect(send.mock.calls[0][0]).toBeInstanceOf(PutObjectCommand);
    expect(send.mock.calls[0][0].input).toMatchObject({
      Bucket: 'gallery',
      Key: 'galleries/test/original.jpg',
      Body: buffer,
      ContentType: 'image/jpeg',
    });
  });

  it('reads an object as a stream without buffering the original in memory', async () => {
    const stream = Readable.from(Buffer.from('jpg'));
    const send = vi
      .spyOn(S3Client.prototype, 'send')
      .mockResolvedValue({ Body: stream, ContentLength: 3 } as never);
    expect(await storage.get('test')).toEqual({ stream, length: 3 });
    expect(send.mock.calls[0][0]).toBeInstanceOf(GetObjectCommand);
    expect(send.mock.calls[0][0].input).toMatchObject({
      Bucket: 'gallery',
      Key: 'test',
    });
  });

  it('fails explicitly without credentials instead of using a local fallback', async () => {
    vi.stubEnv('R2_ACCESS_KEY_ID', '');
    expect(storage.configured).toBe(false);
    await expect(storage.put('test', Buffer.from('jpg'))).rejects.toThrow(
      'nicht konfiguriert',
    );
  });
});
