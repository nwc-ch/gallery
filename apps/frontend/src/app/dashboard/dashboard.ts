import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { GalleriesService, Gallery } from './galleries.service';

@Component({
  selector: 'app-dashboard',
  imports: [FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  protected readonly busy = signal(false);
  protected readonly error = signal('');
  private readonly galleryApi = inject(GalleriesService);
  protected readonly galleries = signal<Gallery[]>([]);
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly success = signal('');
  protected title = '';

  async ngOnInit(): Promise<void> {
    try {
      this.galleries.set(await this.galleryApi.list());
    } catch (error) {
      await this.handleError(
        error,
        'Die Galerien konnten nicht geladen werden. Bitte lade die Seite erneut.',
      );
    } finally {
      this.loading.set(false);
    }
  }

  protected async createGallery(): Promise<void> {
    const title = this.title.trim();
    if (this.saving() || !title || title.length > 160) return;
    this.saving.set(true);
    this.error.set('');
    this.success.set('');
    try {
      const gallery = await this.galleryApi.create(title);
      this.galleries.update((items) => [gallery, ...items]);
      this.title = '';
      this.success.set('Die Galerie wurde angelegt.');
    } catch (error) {
      await this.handleError(
        error,
        'Die Galerie konnte nicht angelegt werden. Bitte versuche es erneut.',
      );
    } finally {
      this.saving.set(false);
    }
  }

  private async handleError(error: unknown, message: string): Promise<void> {
    if (error instanceof HttpErrorResponse && error.status === 401) {
      this.auth.user.set(null);
      await this.router.navigateByUrl('/login');
      return;
    }
    if (error instanceof HttpErrorResponse && error.status === 403) {
      this.error.set('Dir fehlt die Admin-Berechtigung zum Anlegen von Galerien.');
      try {
        await this.auth.loadUser();
      } catch {
        /* Keep the error visible if reloading fails. */
      }
      return;
    }
    this.error.set(message);
  }

  protected async logout(): Promise<void> {
    this.busy.set(true);
    this.error.set('');
    try {
      await this.auth.logout();
      await this.router.navigateByUrl('/login');
    } catch {
      this.error.set('Die Abmeldung ist fehlgeschlagen. Bitte versuche es erneut.');
    } finally {
      this.busy.set(false);
    }
  }
}
