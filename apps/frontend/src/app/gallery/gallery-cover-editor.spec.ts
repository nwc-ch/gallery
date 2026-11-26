import { TestBed } from '@angular/core/testing';
import { GalleryCoverEditor } from './gallery-cover-editor';
import { GalleriesService } from '../dashboard/galleries.service';

describe('album cover selection dialog', () => {
  const api = { saveCover: vi.fn() };
  const image = {
    id: 'image-id',
    filename: 'photo.jpg',
    width: 1800,
    height: 1200,
    byteSize: 1000,
    previewUrl: '/preview.jpg',
    originalUrl: '/original.jpg',
    createdAt: '',
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
    Object.defineProperty(HTMLElement.prototype, 'setPointerCapture', {
      configurable: true,
      value: vi.fn(),
    });
    api.saveCover.mockReset().mockResolvedValue({ id: 'album-id', title: 'Album' });
    TestBed.configureTestingModule({
      imports: [GalleryCoverEditor],
      providers: [{ provide: GalleriesService, useValue: api }],
    });
  });

  function render(
    initialCrop: { x: number; y: number; width: number; height: number } | null = null,
  ) {
    const fixture = TestBed.createComponent(GalleryCoverEditor);
    fixture.componentRef.setInput('galleryId', 'album-id');
    fixture.componentRef.setInput('image', image);
    fixture.componentRef.setInput('initialCrop', initialCrop);
    fixture.detectChanges();
    return fixture;
  }
  function ready(fixture: ReturnType<typeof render>) {
    fixture.nativeElement.querySelector('.crop-stage img').dispatchEvent(new Event('load'));
    fixture.detectChanges();
  }

  it('opens modally and uses a preview without loading the original', () => {
    const fixture = render();
    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalledOnce();
    expect(fixture.nativeElement.querySelector('.crop-stage img').getAttribute('src')).toBe(
      '/preview.jpg',
    );
    expect(fixture.nativeElement.querySelector('.save').disabled).toBe(true);
    ready(fixture);
    expect(fixture.nativeElement.querySelector('.save').disabled).toBe(false);
  });

  it('saves a zoomed crop for the selected album and image', async () => {
    const fixture = render();
    ready(fixture);
    const saved = vi.fn();
    fixture.componentInstance.saved.subscribe(saved);
    const zoom = fixture.nativeElement.querySelector('input[type="range"]');
    zoom.value = '2';
    zoom.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    fixture.nativeElement.querySelector('.save').click();
    await vi.waitFor(() => expect(saved).toHaveBeenCalledOnce());
    expect(api.saveCover).toHaveBeenCalledExactlyOnceWith('album-id', 'image-id', {
      x: 0.25,
      y: 0.25,
      width: 0.5,
      height: 0.5,
    });
  });

  it('can edit an existing crop and move it with arrow keys', async () => {
    const fixture = render({ x: 0.25, y: 0.25, width: 0.5, height: 0.5 });
    ready(fixture);
    fixture.nativeElement
      .querySelector('.crop-stage')
      .dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    fixture.detectChanges();
    fixture.nativeElement.querySelector('.save').click();
    await vi.waitFor(() => expect(api.saveCover).toHaveBeenCalledOnce());
    expect(api.saveCover.mock.calls[0][2].x).toBeCloseTo(0.26);
    expect(api.saveCover.mock.calls[0][2].width).toBe(0.5);
  });

  it('moves the crop by pointer drag and clamps it to image edges', async () => {
    const fixture = render({ x: 0.25, y: 0.25, width: 0.5, height: 0.5 });
    ready(fixture);
    const stage = fixture.nativeElement.querySelector('.crop-stage') as HTMLElement;
    vi.spyOn(stage, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      width: 600,
      height: 400,
    } as DOMRect);
    for (const [type, x, y] of [
      ['pointerdown', 300, 200],
      ['pointermove', 900, 600],
    ] as const) {
      const event = new MouseEvent(type, { clientX: x, clientY: y, button: 0, bubbles: true });
      Object.defineProperty(event, 'pointerId', { value: 1 });
      stage.dispatchEvent(event);
    }
    fixture.detectChanges();
    fixture.nativeElement.querySelector('.save').click();
    await vi.waitFor(() => expect(api.saveCover).toHaveBeenCalledOnce());
    expect(api.saveCover.mock.calls[0][2]).toEqual({ x: 0.5, y: 0.5, width: 0.5, height: 0.5 });
  });

  it('closes without saving and disables save if the image cannot load', () => {
    const fixture = render();
    const closed = vi.fn();
    fixture.componentInstance.closed.subscribe(closed);
    fixture.nativeElement.querySelector('.crop-stage img').dispatchEvent(new Event('error'));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.save').disabled).toBe(true);
    fixture.nativeElement.querySelector('.close').click();
    expect(closed).toHaveBeenCalledOnce();
    expect(api.saveCover).not.toHaveBeenCalled();
  });

  it('keeps the dialog editable after a save failure', async () => {
    api.saveCover.mockRejectedValue(new Error('offline'));
    const fixture = render();
    ready(fixture);
    fixture.nativeElement.querySelector('.save').click();
    await vi.waitFor(() => {
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.error')?.textContent).toContain(
        'nicht gespeichert',
      );
    });
    expect(fixture.nativeElement.querySelector('.save').disabled).toBe(false);
  });
});
