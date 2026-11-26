import {
  Component,
  ElementRef,
  Injector,
  OnDestroy,
  afterNextRender,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { GalleriesService, GalleryImage } from '../dashboard/galleries.service';

@Component({
  selector: 'app-gallery-image-actions',
  templateUrl: './gallery-image-actions.html',
  styleUrl: './gallery-image-actions.scss',
})
export class GalleryImageActions implements OnDestroy {
  readonly galleryId = input.required<string>();
  readonly image = input.required<GalleryImage>();
  readonly isCover = input(false);
  readonly chooseCover = output<void>();
  readonly removed = output<string>();
  protected readonly open = signal(false);
  protected readonly busy = signal(false);
  protected readonly error = signal('');
  private readonly api = inject(GalleriesService);
  private readonly injector = inject(Injector);
  private readonly dialog = viewChild<ElementRef<HTMLDialogElement>>('dialog');
  private readonly trigger = viewChild<ElementRef<HTMLButtonElement>>('trigger');
  private previousOverflow = '';
  private destroyed = false;

  protected show(): void {
    if (this.open()) return;
    this.error.set('');
    this.previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    this.open.set(true);
    afterNextRender(() => this.dialog()?.nativeElement.showModal(), { injector: this.injector });
  }

  protected close(event?: Event): void {
    event?.preventDefault();
    if (this.busy()) return;
    this.dismiss();
    this.trigger()?.nativeElement.focus();
  }

  private dismiss(): void {
    this.dialog()?.nativeElement.close();
    if (this.open()) document.body.style.overflow = this.previousOverflow;
    this.open.set(false);
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.dismiss();
  }

  protected async remove(): Promise<void> {
    if (this.busy()) return;
    this.busy.set(true);
    this.error.set('');
    try {
      await this.api.removeImage(this.galleryId(), this.image().id);
      if (this.destroyed) return;
      this.dismiss();
      this.removed.emit(this.image().id);
    } catch (error) {
      if (this.destroyed) return;
      if (error instanceof HttpErrorResponse && error.status === 404) {
        this.dismiss();
        this.removed.emit(this.image().id);
        return;
      }
      this.error.set(
        error instanceof HttpErrorResponse && [401, 403].includes(error.status)
          ? 'Deine Sitzung ist abgelaufen oder die Admin-Berechtigung fehlt. Bitte melde dich erneut an.'
          : 'Das Bild konnte nicht vollständig gelöscht werden. Original oder Vorschau wurden möglicherweise bereits entfernt. Bitte versuche das Löschen erneut.',
      );
    } finally {
      this.busy.set(false);
    }
  }
}
