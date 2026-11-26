import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { GalleryCategoriesEditor } from './gallery-categories-editor';
import { GalleriesService } from '../dashboard/galleries.service';

describe('Album category editor', () => {
  const travel = { id: 'travel', name: 'Reisen' };
  const family = { id: 'family', name: 'Familie' };
  const api = {
    categories: vi.fn(),
    get: vi.fn(),
    createCategory: vi.fn(),
    saveCategories: vi.fn(),
  };
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
    api.categories.mockReset().mockResolvedValue([travel, family]);
    api.get.mockReset().mockResolvedValue({ categories: [travel] });
    api.createCategory.mockReset().mockResolvedValue({ id: 'new', name: 'Natur' });
    api.saveCategories.mockReset().mockResolvedValue([travel]);
    TestBed.configureTestingModule({
      imports: [GalleryCategoriesEditor],
      providers: [{ provide: GalleriesService, useValue: api }],
    });
  });
  async function render() {
    const fixture = TestBed.createComponent(GalleryCategoriesEditor);
    fixture.componentRef.setInput('galleryId', 'album-id');
    fixture.detectChanges();
    await fixture.whenStable();
    await vi.waitFor(() => {
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('[role="status"]')).toBeNull();
    });
    return fixture;
  }

  it('loads available categories and preselects existing assignments', async () => {
    const fixture = await render();
    const boxes = fixture.nativeElement.querySelectorAll('input[type="checkbox"]');
    expect(api.get).toHaveBeenCalledWith('album-id');
    expect(boxes).toHaveLength(2);
    expect(boxes[0].checked).toBe(false);
    expect(boxes[1].checked).toBe(true);
    expect(fixture.nativeElement.querySelector('dialog').open).toBe(true);
  });

  it('creates a trimmed category and includes it in the saved selection', async () => {
    const fixture = await render();
    const saved = vi.fn();
    fixture.componentInstance.saved.subscribe(saved);
    const input = fixture.nativeElement.querySelector('#new-category') as HTMLInputElement;
    input.value = '  Natur  ';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    fixture.nativeElement
      .querySelector('form')
      .dispatchEvent(new Event('submit', { cancelable: true }));
    await fixture.whenStable();
    fixture.detectChanges();
    expect(api.createCategory).toHaveBeenCalledExactlyOnceWith('Natur');
    expect(fixture.nativeElement.querySelectorAll('input[type="checkbox"]')).toHaveLength(3);
    expect(api.saveCategories).not.toHaveBeenCalled();
    fixture.nativeElement.querySelector('.save-categories').click();
    await fixture.whenStable();
    expect(api.saveCategories).toHaveBeenCalledWith('album-id', ['travel', 'new']);
    expect(saved).toHaveBeenCalledWith([travel]);
  });

  it('allows removing all assignments', async () => {
    const fixture = await render();
    fixture.nativeElement.querySelector('input:checked').click();
    fixture.detectChanges();
    fixture.nativeElement.querySelector('.save-categories').click();
    await fixture.whenStable();
    expect(api.saveCategories).toHaveBeenCalledWith('album-id', []);
  });

  it('shows duplicate category errors without losing the selection', async () => {
    api.createCategory.mockRejectedValue(new HttpErrorResponse({ status: 409 }));
    const fixture = await render();
    const input = fixture.nativeElement.querySelector('#new-category') as HTMLInputElement;
    input.value = 'Reisen';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    fixture.nativeElement
      .querySelector('form')
      .dispatchEvent(new Event('submit', { cancelable: true }));
    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain(
      'existiert bereits',
    );
    expect(fixture.nativeElement.querySelector('input:checked')).not.toBeNull();
    expect(api.saveCategories).not.toHaveBeenCalled();
  });

  it('prevents saving when loading failed and allows retrying', async () => {
    api.categories.mockRejectedValueOnce(new Error('offline'));
    const fixture = await render();
    expect(fixture.nativeElement.querySelector('.save-categories')).toBeNull();
    expect(fixture.nativeElement.querySelector('[role="alert"]')).not.toBeNull();
    const retry = Array.from(fixture.nativeElement.querySelectorAll('button')).find(
      (element: any) => element.textContent.includes('Erneut'),
    ) as HTMLButtonElement;
    retry.click();
    await fixture.whenStable();
    await vi.waitFor(() => {
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.save-categories')).not.toBeNull();
    });
    expect(api.saveCategories).not.toHaveBeenCalled();
  });

  it('keeps the selection on save failure and allows retrying', async () => {
    api.saveCategories.mockRejectedValueOnce(new Error('offline'));
    const fixture = await render();
    const saved = vi.fn();
    fixture.componentInstance.saved.subscribe(saved);
    fixture.nativeElement.querySelector('.save-categories').click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(saved).not.toHaveBeenCalled();
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain(
      'gespeichert',
    );
    expect(fixture.nativeElement.querySelector('input:checked')).not.toBeNull();
    fixture.nativeElement.querySelector('.save-categories').click();
    await fixture.whenStable();
    expect(saved).toHaveBeenCalledTimes(1);
  });

  it('closes without saving when cancelled', async () => {
    const fixture = await render();
    const closed = vi.fn();
    fixture.componentInstance.closed.subscribe(closed);
    fixture.nativeElement
      .querySelector('dialog')
      .dispatchEvent(new Event('cancel', { cancelable: true }));
    expect(closed).toHaveBeenCalledTimes(1);
    expect(api.saveCategories).not.toHaveBeenCalled();
  });
});
