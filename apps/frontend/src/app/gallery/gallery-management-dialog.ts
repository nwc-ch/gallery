import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { GalleriesService, Gallery } from '../dashboard/galleries.service';

@Component({
  selector: 'app-gallery-management-dialog',
  imports: [FormsModule],
  templateUrl: './gallery-management-dialog.html',
  styleUrl: './gallery-management-dialog.scss',
})
export class GalleryManagementDialog implements OnInit, AfterViewInit, OnDestroy {
  readonly gallery = input.required<Gallery>();
  readonly mode = input.required<'rename' | 'delete'>();
  readonly imageCount = input(0);
  readonly closed = output<void>();
  readonly renamed = output<Gallery>();
  readonly removed = output<void>();
  private readonly api = inject(GalleriesService);
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  protected title = '';
  protected confirmed = false;
  protected readonly busy = signal(false);
  protected readonly error = signal('');
  private previousOverflow = '';

  ngOnInit(): void {
    this.title = this.gallery().title;
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
    if (!this.busy()) this.closed.emit();
  }
  protected cancel(event: Event): void {
    event.preventDefault();
    this.close();
  }

  protected async submit(): Promise<void> {
    if (this.busy()) return;
    const title = this.title.trim();
    if (this.mode() === 'rename' && (!title || title.length > 160)) return;
    if (this.mode() === 'delete' && !this.confirmed) return;
    this.busy.set(true);
    this.error.set('');
    try {
      if (this.mode() === 'rename')
        this.renamed.emit(await this.api.rename(this.gallery().id, title));
      else {
        await this.api.remove(this.gallery().id);
        this.removed.emit();
      }
    } catch (error) {
      if (this.mode() === 'delete' && error instanceof HttpErrorResponse && error.status === 404) {
        this.removed.emit();
        return;
      }
      if (error instanceof HttpErrorResponse && [401, 403].includes(error.status)) {
        this.error.set(
          error.status === 401
            ? 'Die Sitzung ist abgelaufen. Bitte melde dich erneut an.'
            : 'Dir fehlt die Admin-Berechtigung für diese Aktion.',
        );
        return;
      }
      this.error.set(
        this.mode() === 'rename'
          ? 'Der Titel konnte nicht gespeichert werden. Bitte versuche es erneut.'
          : 'Das Album konnte nicht vollständig gelöscht werden. Einige Bilder wurden möglicherweise bereits entfernt. Bitte versuche das Löschen erneut.',
      );
    } finally {
      this.busy.set(false);
    }
  }
}
