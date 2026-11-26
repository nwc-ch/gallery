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
import { Category, GalleriesService } from '../dashboard/galleries.service';

@Component({
  selector: 'app-gallery-categories-editor',
  imports: [FormsModule],
  templateUrl: './gallery-categories-editor.html',
  styleUrl: './gallery-categories-editor.scss',
})
export class GalleryCategoriesEditor implements OnInit, AfterViewInit, OnDestroy {
  readonly galleryId = input.required<string>();
  readonly closed = output<void>();
  readonly saved = output<Category[]>();
  private readonly api = inject(GalleriesService);
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  private previousOverflow = '';
  private destroyed = false;
  protected readonly categories = signal<Category[]>([]);
  protected readonly selected = signal<Set<string>>(new Set());
  protected readonly loading = signal(true);
  protected readonly loaded = signal(false);
  protected readonly busy = signal(false);
  protected readonly error = signal('');
  protected name = '';

  ngAfterViewInit(): void {
    this.previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    this.dialog().nativeElement.showModal();
  }
  ngOnDestroy(): void {
    this.destroyed = true;
    this.dialog().nativeElement.close();
    document.body.style.overflow = this.previousOverflow;
  }
  ngOnInit(): void {
    void this.load();
  }

  protected close(event?: Event): void {
    event?.preventDefault();
    if (!this.busy()) this.closed.emit();
  }

  protected async load(): Promise<void> {
    this.loading.set(true);
    this.loaded.set(false);
    this.error.set('');
    try {
      const [categories, gallery] = await Promise.all([
        this.api.categories(),
        this.api.get(this.galleryId()),
      ]);
      if (this.destroyed) return;
      this.categories.set(this.sort(categories));
      this.selected.set(new Set((gallery.categories ?? []).map((category) => category.id)));
      this.loaded.set(true);
    } catch {
      if (!this.destroyed) this.error.set('Die Kategorien konnten nicht geladen werden.');
    } finally {
      if (!this.destroyed) this.loading.set(false);
    }
  }

  protected toggle(id: string, event: Event): void {
    if (this.busy()) return;
    const checked = (event.target as HTMLInputElement).checked;
    this.selected.update((current) => {
      const next = new Set(current);
      if (checked && next.size < 100) next.add(id);
      else if (!checked) next.delete(id);
      return next;
    });
  }

  private sort(categories: Category[]): Category[] {
    return [...categories].sort((a, b) => a.name.localeCompare(b.name, 'de'));
  }

  protected async create(): Promise<void> {
    const name = this.name.trim();
    if (this.busy() || !this.loaded() || !name || name.length > 80) return;
    this.busy.set(true);
    this.error.set('');
    try {
      const category = await this.api.createCategory(name);
      if (this.destroyed) return;
      this.categories.update((current) => this.sort([...current, category]));
      if (this.selected().size < 100)
        this.selected.update((current) => new Set([...current, category.id]));
      this.name = '';
    } catch (error) {
      this.error.set(
        error instanceof HttpErrorResponse && error.status === 409
          ? 'Eine Kategorie mit diesem Namen existiert bereits. Wähle sie aus der Liste aus.'
          : 'Die Kategorie konnte nicht angelegt werden. Bitte versuche es erneut.',
      );
    } finally {
      this.busy.set(false);
    }
  }

  protected async save(): Promise<void> {
    if (this.busy() || !this.loaded()) return;
    this.busy.set(true);
    this.error.set('');
    try {
      const categories = await this.api.saveCategories(this.galleryId(), [...this.selected()]);
      if (!this.destroyed) this.saved.emit(categories);
    } catch {
      this.error.set('Die Zuweisung konnte nicht gespeichert werden. Bitte versuche es erneut.');
    } finally {
      this.busy.set(false);
    }
  }
}
