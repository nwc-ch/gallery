import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  OnInit,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../auth/auth.service';
import { GalleriesService, Gallery, GalleryImage } from '../dashboard/galleries.service';
import { justifiedLayout } from './justified-layout';
import { ImageLightbox } from './image-lightbox';

@Component({
  selector: 'app-gallery-page',
  imports: [RouterLink, ImageLightbox],
  templateUrl: './gallery-page.html',
  styleUrl: './gallery-page.scss',
})
export class GalleryPage implements OnInit, AfterViewInit {
  protected readonly auth = inject(AuthService);
  private readonly api = inject(GalleriesService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly grid = viewChild.required<ElementRef<HTMLDivElement>>('grid');
  protected readonly gallery = signal<Gallery | null>(null);
  protected readonly images = signal<GalleryImage[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal('');
  protected readonly uploadAvailable = signal(false);
  protected readonly uploading = signal(false);
  protected readonly progress = signal('');
  protected readonly uploadErrors = signal<string[]>([]);
  protected readonly selectedIndex = signal<number | null>(null);
  protected readonly failedPreviews = signal<Set<string>>(new Set());
  private readonly width = signal(0);
  protected readonly rows = computed(() =>
    justifiedLayout(this.images(), this.width(), this.width() < 600 ? 160 : 220),
  );
  private generation = 0;
  private destroyed = false;

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.destroyed = true;
    });
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      void this.load(params.get('id') ?? '');
    });
  }
  ngAfterViewInit(): void {
    const element = this.grid().nativeElement;
    this.width.set(element.clientWidth);
    const observer = new ResizeObserver((entries) => this.width.set(entries[0].contentRect.width));
    observer.observe(element);
    this.destroyRef.onDestroy(() => observer.disconnect());
  }

  private async load(id: string): Promise<void> {
    const generation = ++this.generation;
    this.loading.set(true);
    this.error.set('');
    this.gallery.set(null);
    this.images.set([]);
    this.selectedIndex.set(null);
    this.progress.set('');
    this.uploadErrors.set([]);
    try {
      const [gallery, result] = await Promise.all([this.api.get(id), this.api.images(id)]);
      if (generation !== this.generation || this.destroyed) return;
      this.gallery.set(gallery);
      this.images.set(result.images);
      this.uploadAvailable.set(result.uploadAvailable);
    } catch (error) {
      if (generation !== this.generation || this.destroyed) return;
      if (error instanceof HttpErrorResponse && error.status === 401) {
        await this.router.navigateByUrl('/login');
        return;
      }
      this.error.set(
        error instanceof HttpErrorResponse && error.status === 404
          ? 'Diese Galerie wurde nicht gefunden.'
          : 'Die Galerie konnte nicht geladen werden. Bitte lade die Seite erneut.',
      );
    } finally {
      if (generation === this.generation) this.loading.set(false);
    }
  }

  protected previewFailed(id: string): void {
    this.failedPreviews.update((value) => new Set([...value, id]));
  }

  protected async upload(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    const gallery = this.gallery();
    if (!gallery || !files.length || this.uploading()) return;
    this.uploading.set(true);
    this.uploadErrors.set([]);
    let succeeded = 0;
    try {
      for (let index = 0; index < files.length; index++) {
        if (this.destroyed || this.gallery()?.id !== gallery.id) break;
        const file = files[index];
        this.progress.set(`${index + 1} / ${files.length} · ${file.name}`);
        if (!/\.jpe?g$/i.test(file.name) || file.size > 50 * 1024 * 1024 || !file.size) {
          this.uploadErrors.update((errors) => [
            ...errors,
            `${file.name}: Bitte eine JPG-Datei mit höchstens 50 MiB auswählen.`,
          ]);
          continue;
        }
        try {
          const image = await this.api.upload(gallery.id, file);
          if (this.destroyed || this.gallery()?.id !== gallery.id) break;
          this.images.update((images) => [...images, image]);
          succeeded++;
        } catch (error) {
          if (this.destroyed || this.gallery()?.id !== gallery.id) break;
          if (error instanceof HttpErrorResponse && error.status === 401) {
            await this.router.navigateByUrl('/login');
            break;
          }
          if (error instanceof HttpErrorResponse && error.status === 403) {
            this.uploadErrors.update((errors) => [
              ...errors,
              'Die Admin-Berechtigung für den Upload fehlt.',
            ]);
            try {
              await this.auth.loadUser();
            } catch {
              /* Error remains visible. */
            }
            break;
          }
          const message =
            error instanceof HttpErrorResponse &&
            error.status === 400 &&
            typeof error.error?.message === 'string'
              ? error.error.message
              : 'Upload fehlgeschlagen. Bitte erneut versuchen.';
          this.uploadErrors.update((errors) => [...errors, `${file.name}: ${message}`]);
        }
      }
      if (!this.destroyed && this.gallery()?.id === gallery.id)
        this.progress.set(`${succeeded} von ${files.length} Bildern hochgeladen.`);
    } finally {
      this.uploading.set(false);
      input.value = '';
    }
  }
}
