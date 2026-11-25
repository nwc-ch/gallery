import { TestBed } from '@angular/core/testing';
import { GalleryAccessEditor } from './gallery-access-editor';
import { GalleriesService } from '../dashboard/galleries.service';

describe('Album user selection', () => {
  const users = [
    { id: 'admin', name: 'Admin', email: 'admin@example.invalid', role: 'admin' },
    { id: 'alice', name: 'Alice', email: 'alice@example.invalid', role: 'user' },
    { id: 'ben', name: 'Ben', email: 'ben@example.invalid', role: 'user' },
  ];
  const api = { access: vi.fn(), saveAccess: vi.fn() };

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
    api.access.mockReset().mockResolvedValue({ users, userIds: ['alice'] });
    api.saveAccess
      .mockReset()
      .mockImplementation(async (_id: string, userIds: string[]) => ({ userIds }));
    TestBed.configureTestingModule({
      imports: [GalleryAccessEditor],
      providers: [{ provide: GalleriesService, useValue: api }],
    });
  });

  async function render() {
    const fixture = TestBed.createComponent(GalleryAccessEditor);
    fixture.componentRef.setInput('galleryId', 'gallery-1');
    fixture.detectChanges();
    await vi.waitFor(() => {
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('[role="status"]')).toBeNull();
    });
    return fixture;
  }

  it('shows saved selections and always grants admins access', async () => {
    const fixture = await render();
    expect(api.access).toHaveBeenCalledExactlyOnceWith('gallery-1');
    const checks = fixture.nativeElement.querySelectorAll('input[type="checkbox"]');
    expect(checks[0].checked).toBe(true);
    expect(checks[0].disabled).toBe(true);
    expect(checks[1].checked).toBe(true);
    expect(checks[2].checked).toBe(false);
    expect(fixture.nativeElement.querySelector('.actions button').disabled).toBe(true);
  });

  it('saves the chosen users for the current album', async () => {
    const fixture = await render();
    fixture.nativeElement.querySelectorAll('input[type="checkbox"]')[2].click();
    fixture.detectChanges();
    fixture.nativeElement.querySelector('.actions button').click();
    await vi.waitFor(() => {
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.success')?.textContent).toContain('gespeichert');
    });
    expect(api.saveAccess).toHaveBeenCalledExactlyOnceWith('gallery-1', ['alice', 'ben']);
    expect(fixture.nativeElement.querySelector('.actions button').disabled).toBe(true);
  });

  it('supports removing every explicit user permission', async () => {
    const fixture = await render();
    fixture.nativeElement.querySelectorAll('input[type="checkbox"]')[1].click();
    fixture.detectChanges();
    fixture.nativeElement.querySelector('.actions button').click();
    await vi.waitFor(() => expect(api.saveAccess).toHaveBeenCalledExactlyOnceWith('gallery-1', []));
  });

  it('shows a modal with all users and no search field', async () => {
    const fixture = await render();
    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalledOnce();
    expect(fixture.nativeElement.querySelector('dialog').hasAttribute('open')).toBe(true);
    expect(fixture.nativeElement.querySelector('input[type="search"]')).toBeNull();
    expect(fixture.nativeElement.querySelectorAll('input[type="checkbox"]').length).toBe(3);
  });

  it('closes with the close button or Escape without saving changes', async () => {
    const fixture = await render();
    const closed = vi.fn();
    fixture.componentInstance.closed.subscribe(closed);
    fixture.nativeElement.querySelector('.close-button').click();
    expect(closed).toHaveBeenCalledOnce();
    fixture.nativeElement
      .querySelector('dialog')
      .dispatchEvent(new Event('cancel', { cancelable: true }));
    expect(closed).toHaveBeenCalledTimes(2);
    expect(api.saveAccess).not.toHaveBeenCalled();
  });

  it('preserves the pending selection and offers retry after a save failure', async () => {
    api.saveAccess.mockRejectedValue(new Error('offline'));
    const fixture = await render();
    fixture.nativeElement.querySelectorAll('input[type="checkbox"]')[2].click();
    fixture.detectChanges();
    fixture.nativeElement.querySelector('.actions button').click();
    await vi.waitFor(() => {
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('[role="alert"]')?.textContent).toContain(
        'nicht gespeichert',
      );
    });
    expect(fixture.nativeElement.querySelectorAll('input[type="checkbox"]')[2].checked).toBe(true);
    expect(fixture.nativeElement.querySelector('.actions button').disabled).toBe(false);
  });

  it('does not allow saving an empty selection when the initial request fails', async () => {
    api.access.mockRejectedValue(new Error('offline'));
    const fixture = await render();
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain(
      'nicht geladen',
    );
    expect(fixture.nativeElement.querySelector('.actions')).toBeNull();
    expect(api.saveAccess).not.toHaveBeenCalled();
  });
});
