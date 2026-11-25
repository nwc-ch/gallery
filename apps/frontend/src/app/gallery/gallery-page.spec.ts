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
  const api = { get: vi.fn(), images: vi.fn(), upload: vi.fn(), access: vi.fn() };
  beforeEach(() => {
    api.access.mockReset().mockResolvedValue({ users: [], userIds: [] });
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

  it('does not offer upload controls to ordinary users', async () => {
    user.update((value) => ({ ...value!, role: 'user' }));
    const fixture = await render();
    expect(fixture.nativeElement.querySelector('input[type="file"]')).toBeNull();
    expect(fixture.nativeElement.querySelector('app-gallery-access-editor')).toBeNull();
    expect(fixture.nativeElement.querySelector('.image-tile')).not.toBeNull();
  });

  it('keeps uploads unavailable without R2 configuration', async () => {
    api.images.mockResolvedValue({ images: [], uploadAvailable: false });
    const fixture = await render();
    expect(fixture.nativeElement.querySelector('input[type="file"]').disabled).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('Bildspeicher ist noch nicht verfügbar');
  });
});
