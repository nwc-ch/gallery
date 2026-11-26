import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
  ListObjectsV2Command,
  DeleteObjectsCommand,
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

  it('drains every page of an album prefix, including orphan objects', async () => {
    const id = '35c499c6-f354-41ec-92f7-9d7f437bc0fd';
    const prefix = `galleries/${id}/`;
    const send = vi
      .spyOn(S3Client.prototype, 'send')
      .mockResolvedValueOnce({
        Contents: [
          { Key: `${prefix}image/original.jpg` },
          { Key: `${prefix}image/preview.jpg` },
        ],
        IsTruncated: true,
      } as never)
      .mockResolvedValueOnce({} as never)
      .mockResolvedValueOnce({
        Contents: [{ Key: `${prefix}orphan/preview.jpg` }],
      } as never)
      .mockResolvedValueOnce({} as never)
      .mockResolvedValueOnce({ Contents: [] } as never);
    await storage.removeAlbumObjects(id);
    expect(
      send.mock.calls.filter((call) => call[0] instanceof ListObjectsV2Command),
    ).toHaveLength(3);
    const deletes = send.mock.calls.filter(
      (call) => call[0] instanceof DeleteObjectsCommand,
    );
    expect(deletes).toHaveLength(2);
    expect(deletes[0][0].input).toMatchObject({
      Bucket: 'gallery',
      Delete: {
        Objects: [
          { Key: `${prefix}image/original.jpg` },
          { Key: `${prefix}image/preview.jpg` },
        ],
      },
    });
    expect(send.mock.calls[0][0].input).toMatchObject({
      Bucket: 'gallery',
      Prefix: prefix,
      MaxKeys: 1000,
    });
  });

  it('treats per-object deletion errors as failure', async () => {
    const id = '35c499c6-f354-41ec-92f7-9d7f437bc0fd';
    const send = vi
      .spyOn(S3Client.prototype, 'send')
      .mockResolvedValueOnce({
        Contents: [{ Key: `galleries/${id}/image/original.jpg` }],
      } as never)
      .mockResolvedValueOnce({ Errors: [{ Code: 'AccessDenied' }] } as never);
    await expect(storage.removeAlbumObjects(id)).rejects.toThrow(
      'nicht vollständig',
    );
    expect(send).toHaveBeenCalledTimes(2);
  });

  it('refuses bucket-wide or foreign-prefix deletion', async () => {
    const send = vi.spyOn(S3Client.prototype, 'send');
    await expect(storage.removeAlbumObjects('')).rejects.toThrow('Ungültige');
    expect(send).not.toHaveBeenCalled();
    send.mockResolvedValueOnce({
      Contents: [{ Key: 'galleries/another-album/image.jpg' }],
    } as never);
    await expect(
      storage.removeAlbumObjects('35c499c6-f354-41ec-92f7-9d7f437bc0fd'),
    ).rejects.toThrow('nicht vollständig');
    expect(send).toHaveBeenCalledTimes(1);
  });

  it('fails explicitly without credentials instead of using a local fallback', async () => {
    vi.stubEnv('R2_ACCESS_KEY_ID', '');
    expect(storage.configured).toBe(false);
    await expect(storage.put('test', Buffer.from('jpg'))).rejects.toThrow(
      'nicht konfiguriert',
    );
  });
});
