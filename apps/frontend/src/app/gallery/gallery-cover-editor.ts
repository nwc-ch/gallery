import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  computed,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { CoverCrop, GalleriesService, Gallery, GalleryImage } from '../dashboard/galleries.service';
import { coverCrop } from './cover-crop';

@Component({
  selector: 'app-gallery-cover-editor',
  templateUrl: './gallery-cover-editor.html',
  styleUrl: './gallery-cover-editor.scss',
})
export class GalleryCoverEditor implements OnInit, AfterViewInit, OnDestroy {
  readonly galleryId = input.required<string>();
  readonly image = input.required<GalleryImage>();
  readonly initialCrop = input<CoverCrop | null>(null);
  readonly closed = output<void>();
  readonly saved = output<Gallery>();
  private readonly api = inject(GalleriesService);
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  private readonly stage = viewChild.required<ElementRef<HTMLDivElement>>('stage');
  protected readonly zoom = signal(1);
  private readonly center = signal({ x: 0.5, y: 0.5 });
  protected readonly crop = computed(() => coverCrop(this.image(), this.zoom(), this.center()));
  protected readonly loading = signal(true);
  protected readonly failed = signal(false);
  protected readonly saving = signal(false);
  protected readonly error = signal('');
  private previousOverflow = '';
  private drag?: { pointer: number; offsetX: number; offsetY: number };

  ngOnInit(): void {
    const initial = this.initialCrop();
    if (initial) {
      this.zoom.set(coverCrop(this.image()).width / initial.width);
      this.center.set({ x: initial.x + initial.width / 2, y: initial.y + initial.height / 2 });
    }
  }
  ngAfterViewInit(): void {
    this.previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    this.dialog().nativeElement.showModal();
  }
  ngOnDestroy(): void {
    this.dialog().nativeElement.close();
    document.body.style.overflow = this.previousOverflow;
  }
  protected close(): void {
    this.closed.emit();
  }
  protected cancel(event: Event): void {
    event.preventDefault();
    this.close();
  }
  protected loaded(): void {
    this.loading.set(false);
  }
  protected loadFailed(): void {
    this.loading.set(false);
    this.failed.set(true);
  }
  protected changeZoom(event: Event): void {
    this.zoom.set(Number((event.target as HTMLInputElement).value));
  }
  private point(event: PointerEvent) {
    const rect = this.stage().nativeElement.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) / rect.width,
      y: (event.clientY - rect.top) / rect.height,
    };
  }
  protected pointerDown(event: PointerEvent): void {
    if (this.loading() || this.failed() || this.saving() || event.button !== 0) return;
    const point = this.point(event);
    const crop = this.crop();
    const inside =
      point.x >= crop.x &&
      point.x <= crop.x + crop.width &&
      point.y >= crop.y &&
      point.y <= crop.y + crop.height;
    const center = inside ? { x: crop.x + crop.width / 2, y: crop.y + crop.height / 2 } : point;
    this.center.set(center);
    this.drag = {
      pointer: event.pointerId,
      offsetX: center.x - point.x,
      offsetY: center.y - point.y,
    };
    this.stage().nativeElement.focus({ preventScroll: true });
    this.stage().nativeElement.setPointerCapture(event.pointerId);
    event.preventDefault();
  }
  protected pointerMove(event: PointerEvent): void {
    if (!this.drag || this.drag.pointer !== event.pointerId) return;
    const point = this.point(event);
    this.center.set({ x: point.x + this.drag.offsetX, y: point.y + this.drag.offsetY });
  }
  protected pointerUp(): void {
    this.drag = undefined;
  }
  protected keydown(event: KeyboardEvent): void {
    if (this.loading() || this.failed() || this.saving()) return;
    const delta = event.shiftKey ? 0.05 : 0.01;
    const directions: Record<string, [number, number]> = {
      ArrowLeft: [-delta, 0],
      ArrowRight: [delta, 0],
      ArrowUp: [0, -delta],
      ArrowDown: [0, delta],
    };
    const move = directions[event.key];
    if (!move) return;
    event.preventDefault();
    const crop = this.crop();
    this.center.set({
      x: crop.x + crop.width / 2 + move[0],
      y: crop.y + crop.height / 2 + move[1],
    });
  }
  protected async save(): Promise<void> {
    if (this.loading() || this.failed() || this.saving()) return;
    this.saving.set(true);
    this.error.set('');
    try {
      const gallery = await this.api.saveCover(this.galleryId(), this.image().id, this.crop());
      this.saved.emit(gallery);
    } catch {
      this.error.set('Das Albumbild konnte nicht gespeichert werden. Bitte versuche es erneut.');
    } finally {
      this.saving.set(false);
    }
  }
}
