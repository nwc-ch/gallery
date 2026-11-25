import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export interface Gallery {
  id: string;
  title: string;
  createdById: string;
  createdAt: string;
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
