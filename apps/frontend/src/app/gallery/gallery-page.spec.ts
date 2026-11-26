import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { AuthService, AuthUser } from '../auth/auth.service';
import { GalleriesService, GalleryImage } from '../dashboard/galleries.service';
import { GalleryPage } from './gallery-page';

describe('Gallery preview and upload flow', () => {
  const user = signal<AuthUser | null>(null);
  const image: GalleryImage = {
    id: 'image-1',
    filename: 'photo.jpg',
    width: 1800,
    height: 1200,
    byteSize: 100,
    previewUrl: '/preview.jpg',
    originalUrl: '/original.jpg',
    createdAt: '',
  };
  const api = {
    get: vi.fn(),
    images: vi.fn(),
    upload: vi.fn(),
    access: vi.fn(),
    rename: vi.fn(),
    remove: vi.fn(),
  };
  beforeEach(() => {
    Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
      configurable: true,
      value: vi.fn(function (this: HTMLDialogElement) {
        this.setAttribute('open', '');
      }),
    });
    Object.defineProperty(HTMLDialogElement.prototype, 'close', {
      configurable: true,
      value: vi.fn(function (this: HTMLDialogElement) {
        this.removeAttribute('open');
      }),
    });
    api.access.mockReset().mockResolvedValue({ users: [], userIds: [] });
    api.rename.mockReset().mockResolvedValue({ id: 'gallery-id', title: 'Neuer Albumtitel' });
    api.remove.mockReset().mockResolvedValue(undefined);
    user.set({ id: 'user-id', email: 'test@example.invalid', name: 'Test', role: 'admin' });
    api.get.mockReset().mockResolvedValue({ id: 'gallery-id', title: 'Sommer' });
    api.images.mockReset().mockResolvedValue({ images: [image], uploadAvailable: true });
    api.upload.mockReset().mockResolvedValue({
      ...image,
      id: 'image-2',
      filename: 'second.jpg',
      previewUrl: '/second-preview.jpg',
    });
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe() {}
        disconnect() {}
      },
    );
    vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(900);
    TestBed.configureTestingModule({
      imports: [GalleryPage],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { paramMap: of(convertToParamMap({ id: 'gallery-id' })) },
        },
        { provide: AuthService, useValue: { user } },
        { provide: GalleriesService, useValue: api },
      ],
    });
  });
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  async function render() {
    const fixture = TestBed.createComponent(GalleryPage);
    fixture.detectChanges();
    await fixture.whenStable();
    await vi.waitFor(() => {
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('h1').textContent).toBe('Sommer');
    });
    return fixture;
  }

  it('uses preview URLs only until the image viewer is opened', async () => {
    const fixture = await render();
    const images = fixture.nativeElement.querySelectorAll('img');
    expect(images.length).toBe(1);
    expect(images[0].getAttribute('src')).toBe('/preview.jpg');
    expect(fixture.nativeElement.querySelector('app-image-lightbox')).toBeNull();
  });

  it('lets admins choose a cover without opening the original image viewer', async () => {
    const fixture = await render();
    fixture.nativeElement.querySelector('.choose-cover').click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-gallery-cover-editor')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('app-image-lightbox')).toBeNull();
    fixture.nativeElement.querySelector('app-gallery-cover-editor .close').click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-gallery-cover-editor')).toBeNull();
  });

  it('loads permissions only after clicking the three-dot button and closes the dialog', async () => {
    const fixture = await render();
    expect(api.access).not.toHaveBeenCalled();
    expect(fixture.nativeElement.querySelector('app-gallery-access-editor')).toBeNull();
    const trigger = fixture.nativeElement.querySelector('.album-options');
    trigger.click();
    fixture.detectChanges();
    expect(api.access).not.toHaveBeenCalled();
    fixture.nativeElement.querySelector('.manage-access').click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(api.access).toHaveBeenCalledExactlyOnceWith('gallery-id');
    expect(fixture.nativeElement.querySelector('dialog')).not.toBeNull();
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    fixture.nativeElement.querySelector('.close-button').click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-gallery-access-editor')).toBeNull();
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('adds each uploaded image to the preview gallery', async () => {
    const fixture = await render();
    const input = fixture.nativeElement.querySelector('input[type="file"]');
    const file = new File(['jpg'], 'second.jpg', { type: 'image/jpeg' });
    Object.defineProperty(input, 'files', { configurable: true, value: [file] });
    input.dispatchEvent(new Event('change'));
    await fixture.whenStable();
    fixture.detectChanges();
    expect(api.upload).toHaveBeenCalledExactlyOnceWith('gallery-id', file);
    expect(fixture.nativeElement.querySelectorAll('.image-tile').length).toBe(2);
    expect(fixture.nativeElement.querySelector('[role="status"]').textContent).toContain('1 von 1');
  });

  it('updates the title after saving it through the album actions', async () => {
    const fixture = await render();
    fixture.nativeElement.querySelector('.album-options').click();
    fixture.detectChanges();
    fixture.nativeElement.querySelector('.manage-title').click();
    fixture.detectChanges();
    await fixture.whenStable();
    const input = fixture.nativeElement.querySelector('.management-dialog input[type="text"]');
    input.value = 'Neuer Albumtitel';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    fixture.nativeElement
      .querySelector('.management-dialog form')
      .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await vi.waitFor(() => {
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('h1').textContent).toBe('Neuer Albumtitel');
    });
    expect(fixture.nativeElement.querySelector('app-gallery-management-dialog')).toBeNull();
  });

  it('returns to the dashboard after confirming album deletion', async () => {
    const fixture = await render();
    const router = TestBed.inject((await import('@angular/router')).Router);
    const navigate = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    fixture.nativeElement.querySelector('.album-options').click();
    fixture.detectChanges();
    fixture.nativeElement.querySelector('.manage-delete').click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.nativeElement.querySelector('.management-dialog input[type="checkbox"]').click();
    fixture.detectChanges();
    fixture.nativeElement
      .querySelector('.management-dialog form')
      .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await vi.waitFor(() => expect(navigate).toHaveBeenCalledWith('/dashboard'));
    expect(api.remove).toHaveBeenCalledExactlyOnceWith('gallery-id');
  });

  it('does not offer upload controls to ordinary users', async () => {
    user.update((value) => ({ ...value!, role: 'user' }));
    const fixture = await render();
    expect(fixture.nativeElement.querySelector('input[type="file"]')).toBeNull();
    expect(fixture.nativeElement.querySelector('app-gallery-access-editor')).toBeNull();
    expect(fixture.nativeElement.querySelector('.image-tile')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.album-options')).toBeNull();
    expect(fixture.nativeElement.querySelector('.choose-cover')).toBeNull();
  });

  it('keeps uploads unavailable without R2 configuration', async () => {
    api.images.mockResolvedValue({ images: [], uploadAvailable: false });
    const fixture = await render();
    expect(fixture.nativeElement.querySelector('input[type="file"]').disabled).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('Bildspeicher ist noch nicht verfügbar');
  });
});
