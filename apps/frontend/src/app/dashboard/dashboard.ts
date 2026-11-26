import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { GalleriesService, Gallery } from './galleries.service';

@Component({
  selector: 'app-dashboard',
  imports: [FormsModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit, OnDestroy {
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  protected readonly busy = signal(false);
  protected readonly error = signal('');
  private readonly galleryApi = inject(GalleriesService);
  protected readonly galleries = signal<Gallery[]>([]);
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly success = signal('');
  private readonly filterStorageKey = 'gallery.album-title-filter';
  protected readonly filter = signal(this.readFilter());
  protected readonly filteredGalleries = computed(() => {
    const query = this.filter().trim().toLocaleLowerCase('de');
    return this.galleries().filter((gallery) =>
      gallery.title.toLocaleLowerCase('de').includes(query),
    );
  });
  protected readonly createError = signal('');
  private readonly createDialog = viewChild<ElementRef<HTMLDialogElement>>('createDialog');
  private previousOverflow = '';
  private dialogOpen = false;
  protected title = '';

  private readFilter(): string {
    try {
      return localStorage.getItem(this.filterStorageKey) ?? '';
    } catch {
      return '';
    }
  }

  protected updateFilter(value: string): void {
    this.filter.set(value);
    try {
      if (value.trim()) localStorage.setItem(this.filterStorageKey, value);
      else localStorage.removeItem(this.filterStorageKey);
    } catch {
      // Filtering still works when browser storage is unavailable.
    }
  }

  protected openCreate(): void {
    const dialog = this.createDialog()?.nativeElement;
    if (!dialog || this.dialogOpen) return;
    this.title = '';
    this.createError.set('');
    this.success.set('');
    this.previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    this.dialogOpen = true;
    dialog.showModal();
  }

  protected closeCreate(event?: Event): void {
    event?.preventDefault();
    if (!this.saving()) this.dismissCreate();
  }

  private dismissCreate(): void {
    this.createDialog()?.nativeElement.close();
    if (this.dialogOpen) document.body.style.overflow = this.previousOverflow;
    this.dialogOpen = false;
  }

  ngOnDestroy(): void {
    this.dismissCreate();
  }

  async ngOnInit(): Promise<void> {
    try {
      this.galleries.set(this.sortGalleries(await this.galleryApi.list()));
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
    this.createError.set('');
    this.success.set('');
    try {
      const gallery = await this.galleryApi.create(title);
      this.galleries.update((items) => this.sortGalleries([...items, gallery]));
      this.title = '';
      this.success.set('Die Galerie wurde angelegt.');
      this.dismissCreate();
    } catch (error) {
      const message = 'Die Galerie konnte nicht angelegt werden. Bitte versuche es erneut.';
      this.createError.set(message);
      if (error instanceof HttpErrorResponse && [401, 403].includes(error.status)) {
        this.dismissCreate();
        await this.handleError(error, message);
      }
    } finally {
      this.saving.set(false);
    }
  }

  private sortGalleries(items: Gallery[]): Gallery[] {
    return [...items].sort(
      (a, b) =>
        b.title.localeCompare(a.title, 'de', { sensitivity: 'base', numeric: true }) ||
        b.id.localeCompare(a.id),
    );
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
