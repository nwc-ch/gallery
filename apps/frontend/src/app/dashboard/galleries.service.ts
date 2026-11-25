import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export interface Gallery {
  id: string;
  title: string;
  createdById: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class GalleriesService {
  private readonly http = inject(HttpClient);

  list(): Promise<Gallery[]> {
    return firstValueFrom(this.http.get<Gallery[]>('/api/galleries'));
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
