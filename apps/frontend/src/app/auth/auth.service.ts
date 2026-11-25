import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  readonly user = signal<AuthUser | null>(null);

  async loadUser(): Promise<AuthUser | null> {
    try {
      const user = await firstValueFrom(this.http.get<AuthUser>('/api/auth/me'));
      this.user.set(user);
      return user;
    } catch (error) {
      this.user.set(null);
      if (error instanceof HttpErrorResponse && error.status === 401) return null;
      throw error;
    }
  }

  config() {
    return firstValueFrom(this.http.get<{ googleConfigured: boolean }>('/api/auth/config'));
  }

  async logout(): Promise<void> {
    await firstValueFrom(
      this.http.post('/api/auth/logout', {}, { headers: { 'X-Requested-With': 'Gallery' } }),
    );
    this.user.set(null);
  }
}
