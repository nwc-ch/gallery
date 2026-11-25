import { Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { AuthUser } from '../auth/auth.service';
import { GalleriesService } from '../dashboard/galleries.service';

@Component({
  selector: 'app-gallery-access-editor',
  templateUrl: './gallery-access-editor.html',
  styleUrl: './gallery-access-editor.scss',
})
export class GalleryAccessEditor implements OnInit {
  readonly galleryId = input.required<string>();
  private readonly api = inject(GalleriesService);
  protected readonly users = signal<AuthUser[]>([]);
  protected readonly selected = signal<Set<string>>(new Set());
  private readonly saved = signal<Set<string>>(new Set());
  protected readonly query = signal('');
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly error = signal('');
  protected readonly success = signal('');
  protected readonly loaded = signal(false);
  protected readonly dirty = computed(
    () =>
      this.selected().size !== this.saved().size ||
      [...this.selected()].some((id) => !this.saved().has(id)),
  );
  protected readonly visibleUsers = computed(() => {
    const query = this.query().trim().toLocaleLowerCase('de');
    return this.users().filter((user) =>
      `${user.name} ${user.email}`.toLocaleLowerCase('de').includes(query),
    );
  });

  async ngOnInit(): Promise<void> {
    await this.load();
  }
  protected async load(): Promise<void> {
    this.loading.set(true);
    this.error.set('');
    try {
      const access = await this.api.access(this.galleryId());
      this.users.set(access.users);
      this.selected.set(new Set(access.userIds));
      this.saved.set(new Set(access.userIds));
      this.loaded.set(true);
    } catch {
      this.error.set('Die Benutzerfreigaben konnten nicht geladen werden.');
    } finally {
      this.loading.set(false);
    }
  }
  protected search(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }
  protected toggle(id: string, event: Event): void {
    if (this.saving()) return;
    const checked = (event.target as HTMLInputElement).checked;
    this.selected.update((previous) => {
      const next = new Set(previous);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
    this.success.set('');
  }
  protected async save(): Promise<void> {
    if (!this.loaded() || !this.dirty() || this.saving()) return;
    this.saving.set(true);
    this.error.set('');
    this.success.set('');
    try {
      const result = await this.api.saveAccess(this.galleryId(), [...this.selected()]);
      this.selected.set(new Set(result.userIds));
      this.saved.set(new Set(result.userIds));
      this.success.set('Die Albumfreigaben wurden gespeichert.');
    } catch {
      this.error.set(
        'Die Freigaben konnten nicht gespeichert werden. Deine Auswahl wurde nicht übernommen.',
      );
    } finally {
      this.saving.set(false);
    }
  }
}
