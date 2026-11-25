import { TestBed } from '@angular/core/testing';
import { ImageLightbox } from './image-lightbox';
import { GalleryImage } from '../dashboard/galleries.service';

describe('Original image viewer', () => {
  const images: GalleryImage[] = [0, 1, 2].map((index) => ({
    id: `${index}`,
    filename: `photo-${index}.jpg`,
    width: 1800,
    height: 1200,
    byteSize: 1000,
    previewUrl: `/preview-${index}.jpg`,
    originalUrl: `/original-${index}.jpg`,
    createdAt: '',
  }));

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
    Object.defineProperty(HTMLElement.prototype, 'scrollTo', {
      configurable: true,
      value: vi.fn(),
    });
    TestBed.configureTestingModule({ imports: [ImageLightbox] });
  });
  afterEach(() => vi.restoreAllMocks());

  function render(start = 0, collection = images) {
    const fixture = TestBed.createComponent(ImageLightbox);
    fixture.componentRef.setInput('images', collection);
    fixture.componentRef.setInput('initialIndex', start);
    fixture.detectChanges();
    return fixture;
  }

  it('loads only the selected original and has no previous button on the first image', () => {
    const fixture = render();
    expect(fixture.nativeElement.querySelectorAll('img').length).toBe(1);
    expect(fixture.nativeElement.querySelector('img').getAttribute('src')).toBe('/original-0.jpg');
    expect(fixture.nativeElement.querySelector('.previous')).toBeNull();
    expect(fixture.nativeElement.querySelector('.next')).not.toBeNull();
  });

  it('navigates in order and stops at the last image without wrapping', () => {
    const fixture = render();
    const dialog = fixture.nativeElement.querySelector('dialog');
    fixture.nativeElement.querySelector('.next').click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('img').getAttribute('src')).toBe('/original-1.jpg');
    expect(fixture.nativeElement.querySelector('.previous')).not.toBeNull();
    dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.next')).toBeNull();
    dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('img').getAttribute('src')).toBe('/original-2.jpg');
    dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('img').getAttribute('src')).toBe('/original-1.jpg');
  });

  it('shows neither navigation button for a single image', () => {
    const fixture = render(0, [images[0]]);
    expect(fixture.nativeElement.querySelector('.previous')).toBeNull();
    expect(fixture.nativeElement.querySelector('.next')).toBeNull();
  });

  it('supports 100 percent inspection once the original has loaded', () => {
    const fixture = render();
    fixture.nativeElement.querySelector('img').dispatchEvent(new Event('load'));
    fixture.detectChanges();
    fixture.nativeElement.querySelector('.tools button').click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.stage').classList.contains('zoomed')).toBe(true);
    expect(fixture.nativeElement.querySelector('.tools button').textContent).toContain('Einpassen');
  });

  it('provides retry feedback on an original load failure', () => {
    const fixture = render();
    fixture.nativeElement.querySelector('img').dispatchEvent(new Event('error'));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain(
      'nicht geladen',
    );
    fixture.nativeElement.querySelector('.message button').click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('img').getAttribute('src')).toBe(
      '/original-0.jpg?retry=1',
    );
  });

  it('supports Escape cancellation and restores body scrolling on close', () => {
    const fixture = render();
    const closed = vi.fn();
    fixture.componentInstance.closed.subscribe(closed);
    expect(document.body.style.overflow).toBe('hidden');
    fixture.nativeElement
      .querySelector('dialog')
      .dispatchEvent(new Event('cancel', { cancelable: true }));
    expect(closed).toHaveBeenCalledOnce();
    fixture.destroy();
    expect(document.body.style.overflow).not.toBe('hidden');
  });
});
