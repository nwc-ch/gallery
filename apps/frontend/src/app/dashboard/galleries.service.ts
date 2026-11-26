import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AuthUser } from '../auth/auth.service';

export interface GalleryAccess {
  users: AuthUser[];
  userIds: string[];
}

export interface Gallery {
  id: string;
  title: string;
  createdById: string;
  createdAt: string;
  coverImageId?: string | null;
  coverCrop?: CoverCrop | null;
}

export interface CoverCrop {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface GalleryImage {
  id: string;
  filename: string;
  width: number;
  height: number;
  byteSize: number;
  previewUrl: string;
  originalUrl: string;
  createdAt: string;
}

export interface GalleryImages {
  images: GalleryImage[];
  uploadAvailable: boolean;
}

@Injectable({ providedIn: 'root' })
export class GalleriesService {
  saveCover(id: string, imageId: string, crop: CoverCrop): Promise<Gallery> {
    return firstValueFrom(
      this.http.put<Gallery>(
        `/api/galleries/${encodeURIComponent(id)}/cover`,
        { imageId, crop },
        { headers: { 'X-Requested-With': 'Gallery' } },
      ),
    );
  }
  access(id: string): Promise<GalleryAccess> {
    return firstValueFrom(
      this.http.get<GalleryAccess>(`/api/galleries/${encodeURIComponent(id)}/access`),
    );
  }

  saveAccess(id: string, userIds: string[]): Promise<{ userIds: string[] }> {
    return firstValueFrom(
      this.http.put<{ userIds: string[] }>(
        `/api/galleries/${encodeURIComponent(id)}/access`,
        { userIds },
        { headers: { 'X-Requested-With': 'Gallery' } },
      ),
    );
  }
  private readonly http = inject(HttpClient);

  list(): Promise<Gallery[]> {
    return firstValueFrom(this.http.get<Gallery[]>('/api/galleries'));
  }

  get(id: string): Promise<Gallery> {
    return firstValueFrom(this.http.get<Gallery>(`/api/galleries/${encodeURIComponent(id)}`));
  }

  images(id: string): Promise<GalleryImages> {
    return firstValueFrom(
      this.http.get<GalleryImages>(`/api/galleries/${encodeURIComponent(id)}/images`),
    );
  }

  upload(id: string, file: File): Promise<GalleryImage> {
    const body = new FormData();
    body.append('file', file);
    return firstValueFrom(
      this.http.post<GalleryImage>(`/api/galleries/${encodeURIComponent(id)}/images`, body, {
        headers: { 'X-Requested-With': 'Gallery' },
      }),
    );
  }

  create(title: string): Promise<Gallery> {
    return firstValueFrom(
      this.http.post<Gallery>(
        '/api/galleries',
        { title },
        { headers: { 'X-Requested-With': 'Gallery' } },
      ),
    );
  }
}
