import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { AuthService, AuthUser } from '../auth/auth.service';
import { GalleriesService } from './galleries.service';
import { Dashboard } from './dashboard';

describe('Dashboard galleries', () => {
  const user = signal<AuthUser | null>(null);
  const galleries = { list: vi.fn(), create: vi.fn() };

  beforeEach(() => {
    Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
      configurable: true,
      value: function (this: HTMLDialogElement) {
        this.setAttribute('open', '');
      },
    });
    Object.defineProperty(HTMLDialogElement.prototype, 'close', {
      configurable: true,
      value: function (this: HTMLDialogElement) {
        this.removeAttribute('open');
      },
    });
    user.set({ id: 'google-id', email: 'test@example.invalid', name: 'Test User', role: 'user' });
    galleries.list.mockReset().mockResolvedValue([]);
    galleries.create.mockReset();
    TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: { user } },
        { provide: GalleriesService, useValue: galleries },
      ],
    });
  });

  async function render() {
    const fixture = TestBed.createComponent(Dashboard);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    return fixture;
  }

  it('shows no creation form to a regular user', async () => {
    const fixture = await render();
    expect(fixture.nativeElement.querySelector('form')).toBeNull();
    expect(fixture.nativeElement.querySelector('.add-album')).toBeNull();
    expect(fixture.nativeElement.textContent).toContain('Noch keine Galerien');
  });

  it('shows the stored album cover crop using the preview image', async () => {
    galleries.list.mockResolvedValue([
      {
        id: 'album-id',
        title: 'Album',
        coverImageId: 'image-id',
        coverCrop: { x: 0.25, y: 0.25, width: 0.5, height: 0.5 },
      },
    ]);
    const fixture = await render();
    const cover = fixture.nativeElement.querySelector('.album-cover img') as HTMLImageElement;
    expect(cover.getAttribute('src')).toBe('/api/galleries/album-id/images/image-id/preview');
    expect(cover.style.width).toBe('200%');
    expect(cover.style.left).toBe('-50%');
    expect(cover.style.top).toBe('-50%');
  });

  it('sorts albums alphabetically by title, including umlauts', async () => {
    galleries.list.mockResolvedValue([
      { id: 'winter', title: 'Winter' },
      { id: 'berge', title: 'berge' },
      { id: 'aepfel', title: 'Äpfel' },
    ]);
    const fixture = await render();
    const titles = Array.from(
      fixture.nativeElement.querySelectorAll('.gallery-card h3'),
      (element: any) => element.textContent.trim(),
    );
    expect(titles).toEqual(['Äpfel', 'berge', 'Winter']);
  });

  it('inserts a new gallery for an admin in alphabetical order', async () => {
    user.update((value) => ({ ...value!, role: 'admin' }));
    galleries.list.mockResolvedValue([
      { id: 'winter', title: 'Winter' },
      { id: 'fruehling', title: 'Frühling' },
    ]);
    galleries.create.mockResolvedValue({
      id: 'gallery-id',
      title: 'Sommer',
      createdById: 'google-id',
      createdAt: new Date().toISOString(),
    });
    const fixture = await render();
    expect(fixture.nativeElement.querySelector('dialog').open).toBe(false);
    fixture.nativeElement.querySelector('.add-album').click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('dialog').open).toBe(true);
    const input = fixture.nativeElement.querySelector('#gallery-title') as HTMLInputElement;
    input.value = '  Sommer  ';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    fixture.nativeElement
      .querySelector('form')
      .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await fixture.whenStable();
    fixture.detectChanges();
    expect(galleries.create).toHaveBeenCalledExactlyOnceWith('Sommer');
    const titles = Array.from(
      fixture.nativeElement.querySelectorAll('.gallery-card h3'),
      (element: any) => element.textContent.trim(),
    );
    expect(titles).toEqual(['Frühling', 'Sommer', 'Winter']);
    expect(input.value).toBe('');
    expect(fixture.nativeElement.querySelector('dialog').open).toBe(false);
    expect(fixture.nativeElement.querySelector('[role="status"]').textContent).toContain(
      'angelegt',
    );
  });

  it('disables submission for an empty title', async () => {
    user.update((value) => ({ ...value!, role: 'admin' }));
    const fixture = await render();
    expect(fixture.nativeElement.querySelector('button[type="submit"]').disabled).toBe(true);
    expect(galleries.create).not.toHaveBeenCalled();
  });

  it('filters titles without case sensitivity and restores albums when cleared', async () => {
    galleries.list.mockResolvedValue([
      { id: 'winter', title: 'Winter in Zürich' },
      { id: 'sommer', title: 'Sommer' },
    ]);
    const fixture = await render();
    const input = fixture.nativeElement.querySelector('#album-filter') as HTMLInputElement;
    const filter = async (query: string) => {
      input.value = query;
      input.dispatchEvent(new Event('input'));
      await fixture.whenStable();
      fixture.detectChanges();
    };
    await filter('  ZÜRICH  ');
    expect(fixture.nativeElement.querySelectorAll('.gallery-card')).toHaveLength(1);
    expect(fixture.nativeElement.querySelector('.gallery-card').textContent).toContain('Winter');
    await filter('Unbekannt');
    expect(fixture.nativeElement.querySelectorAll('.gallery-card')).toHaveLength(0);
    expect(fixture.nativeElement.textContent).toContain('Keine Alben zu diesem Titel gefunden.');
    await filter('');
    expect(fixture.nativeElement.querySelectorAll('.gallery-card')).toHaveLength(2);
    expect(galleries.list).toHaveBeenCalledTimes(1);
  });

  it('closes the create dialog with close button or Escape without saving', async () => {
    user.update((value) => ({ ...value!, role: 'admin' }));
    const fixture = await render();
    const dialog = fixture.nativeElement.querySelector('dialog') as HTMLDialogElement;
    fixture.nativeElement.querySelector('.add-album').click();
    fixture.detectChanges();
    expect(dialog.open).toBe(true);
    fixture.nativeElement.querySelector('.close-dialog').click();
    expect(dialog.open).toBe(false);
    fixture.nativeElement.querySelector('.add-album').click();
    dialog.dispatchEvent(new Event('cancel', { cancelable: true }));
    expect(dialog.open).toBe(false);
    expect(galleries.create).not.toHaveBeenCalled();
  });

  it('keeps the create dialog and title open after a failed request', async () => {
    user.update((value) => ({ ...value!, role: 'admin' }));
    galleries.create.mockRejectedValue(new Error('offline'));
    const fixture = await render();
    fixture.nativeElement.querySelector('.add-album').click();
    const input = fixture.nativeElement.querySelector('#gallery-title') as HTMLInputElement;
    input.value = 'Sommer';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    fixture.nativeElement
      .querySelector('form')
      .dispatchEvent(new Event('submit', { cancelable: true }));
    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('dialog').open).toBe(true);
    expect(input.value).toBe('Sommer');
    expect(fixture.nativeElement.querySelector('dialog [role="alert"]').textContent).toContain(
      'erneut',
    );
    expect(fixture.nativeElement.querySelector('button[type="submit"]').disabled).toBe(false);
  });
});
