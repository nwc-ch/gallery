import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  computed,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { GalleryImage } from '../dashboard/galleries.service';

@Component({
  selector: 'app-image-lightbox',
  templateUrl: './image-lightbox.html',
  styleUrl: './image-lightbox.scss',
})
export class ImageLightbox implements OnInit, AfterViewInit, OnDestroy {
  readonly images = input.required<GalleryImage[]>();
  readonly initialIndex = input(0);
  readonly closed = output<void>();
  protected readonly index = signal(0);
  protected readonly current = computed(() => this.images()[this.index()]);
  protected readonly zoomed = signal(false);
  protected readonly loading = signal(true);
  protected readonly failed = signal(false);
  private readonly attempt = signal(0);
  protected readonly source = computed(
    () => this.current().originalUrl + (this.attempt() ? `?retry=${this.attempt()}` : ''),
  );
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  private readonly stage = viewChild.required<ElementRef<HTMLDivElement>>('stage');
  private previousOverflow = '';
  private drag?: { x: number; y: number; left: number; top: number; pointerId: number };

  ngOnInit(): void {
    this.index.set(Math.max(0, Math.min(this.initialIndex(), this.images().length - 1)));
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
  protected move(delta: number): void {
    const next = this.index() + delta;
    if (next < 0 || next >= this.images().length) return;
    this.drag = undefined;
    this.loading.set(true);
    this.failed.set(false);
    this.zoomed.set(false);
    this.attempt.set(0);
    this.index.set(next);
    this.stage().nativeElement.scrollTo(0, 0);
  }
  protected keydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      this.move(event.key === 'ArrowLeft' ? -1 : 1);
    }
  }
  protected loaded(): void {
    this.loading.set(false);
  }
  protected loadFailed(): void {
    this.loading.set(false);
    this.failed.set(true);
  }
  protected retry(): void {
    this.failed.set(false);
    this.loading.set(true);
    this.attempt.update((value) => value + 1);
  }
  protected toggleZoom(): void {
    if (this.loading() || this.failed()) return;
    this.drag = undefined;
    this.zoomed.update((value) => !value);
    if (!this.zoomed()) this.stage().nativeElement.scrollTo(0, 0);
  }
  protected pointerDown(event: PointerEvent): void {
    if (!this.zoomed() || event.button !== 0 || event.pointerType === 'touch') return;
    const stage = this.stage().nativeElement;
    this.drag = {
      x: event.clientX,
      y: event.clientY,
      left: stage.scrollLeft,
      top: stage.scrollTop,
      pointerId: event.pointerId,
    };
    stage.setPointerCapture(event.pointerId);
    event.preventDefault();
  }
  protected pointerMove(event: PointerEvent): void {
    if (!this.drag || event.pointerId !== this.drag.pointerId) return;
    const stage = this.stage().nativeElement;
    stage.scrollLeft = this.drag.left - (event.clientX - this.drag.x);
    stage.scrollTop = this.drag.top - (event.clientY - this.drag.y);
  }
  protected pointerUp(): void {
    this.drag = undefined;
  }
}
