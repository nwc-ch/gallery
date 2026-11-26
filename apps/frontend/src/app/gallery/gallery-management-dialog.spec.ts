import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { GalleryManagementDialog } from './gallery-management-dialog';
import { GalleriesService } from '../dashboard/galleries.service';

describe('Album rename and delete dialogs', () => {
  const gallery = {
    id: 'album-id',
    title: 'Bisheriger Titel',
    createdById: 'admin-id',
    createdAt: '',
  };
  const api = { rename: vi.fn(), remove: vi.fn() };
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
    api.rename.mockReset().mockResolvedValue({ ...gallery, title: 'Neuer Titel' });
    api.remove.mockReset().mockResolvedValue(undefined);
    TestBed.configureTestingModule({
      imports: [GalleryManagementDialog],
      providers: [{ provide: GalleriesService, useValue: api }],
    });
  });

  async function render(mode: 'rename' | 'delete') {
    const fixture = TestBed.createComponent(GalleryManagementDialog);
    fixture.componentRef.setInput('gallery', gallery);
    fixture.componentRef.setInput('mode', mode);
    fixture.componentRef.setInput('imageCount', 7);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    return fixture;
  }
  function submit(fixture: Awaited<ReturnType<typeof render>>) {
    fixture.nativeElement
      .querySelector('form')
      .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();
  }

  it('prefills the title and saves the trimmed change', async () => {
    const fixture = await render('rename');
    const renamed = vi.fn();
    fixture.componentInstance.renamed.subscribe(renamed);
    const input = fixture.nativeElement.querySelector('input[type="text"]');
    expect(input.value).toBe('Bisheriger Titel');
    input.value = '  Neuer Titel  ';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    submit(fixture);
    await vi.waitFor(() => expect(renamed).toHaveBeenCalledOnce());
    expect(api.rename).toHaveBeenCalledExactlyOnceWith('album-id', 'Neuer Titel');
    expect(api.remove).not.toHaveBeenCalled();
  });

  it('does not allow a blank title', async () => {
    const fixture = await render('rename');
    const input = fixture.nativeElement.querySelector('input[type="text"]');
    input.value = '   ';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.submit').disabled).toBe(true);
    submit(fixture);
    expect(api.rename).not.toHaveBeenCalled();
  });

  it('requires explicit confirmation before deleting the album and pictures', async () => {
    const fixture = await render('delete');
    const removed = vi.fn();
    fixture.componentInstance.removed.subscribe(removed);
    expect(fixture.nativeElement.textContent).toContain('7 Bildern');
    expect(fixture.nativeElement.querySelector('.submit').disabled).toBe(true);
    submit(fixture);
    expect(api.remove).not.toHaveBeenCalled();
    fixture.nativeElement.querySelector('input[type="checkbox"]').click();
    fixture.detectChanges();
    submit(fixture);
    await vi.waitFor(() => expect(removed).toHaveBeenCalledOnce());
    expect(api.remove).toHaveBeenCalledExactlyOnceWith('album-id');
  });

  it('prevents closing or submitting twice during deletion', async () => {
    let finish!: () => void;
    api.remove.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          finish = resolve;
        }),
    );
    const fixture = await render('delete');
    const closed = vi.fn();
    fixture.componentInstance.closed.subscribe(closed);
    fixture.nativeElement.querySelector('input[type="checkbox"]').click();
    fixture.detectChanges();
    submit(fixture);
    expect(fixture.nativeElement.querySelector('.close').disabled).toBe(true);
    fixture.nativeElement
      .querySelector('dialog')
      .dispatchEvent(new Event('cancel', { cancelable: true }));
    submit(fixture);
    expect(closed).not.toHaveBeenCalled();
    expect(api.remove).toHaveBeenCalledOnce();
    finish();
    await fixture.whenStable();
  });

  it('keeps the dialog open and allows retry after a partial deletion error', async () => {
    api.remove
      .mockRejectedValueOnce(new HttpErrorResponse({ status: 503 }))
      .mockResolvedValue(undefined);
    const fixture = await render('delete');
    const removed = vi.fn();
    fixture.componentInstance.removed.subscribe(removed);
    fixture.nativeElement.querySelector('input[type="checkbox"]').click();
    fixture.detectChanges();
    submit(fixture);
    await vi.waitFor(() => {
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.error')?.textContent).toContain('erneut');
    });
    expect(removed).not.toHaveBeenCalled();
    expect(fixture.nativeElement.querySelector('.submit').disabled).toBe(false);
    submit(fixture);
    await vi.waitFor(() => expect(removed).toHaveBeenCalledOnce());
  });

  it('cancels without deleting anything', async () => {
    const fixture = await render('delete');
    const closed = vi.fn();
    fixture.componentInstance.closed.subscribe(closed);
    fixture.nativeElement.querySelector('.secondary').click();
    expect(closed).toHaveBeenCalledOnce();
    expect(api.remove).not.toHaveBeenCalled();
  });
});
