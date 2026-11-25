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
    expect(fixture.nativeElement.textContent).toContain('Noch keine Galerien');
  });

  it('creates a gallery for an admin and shows it immediately', async () => {
    user.update((value) => ({ ...value!, role: 'admin' }));
    galleries.create.mockResolvedValue({
      id: 'gallery-id',
      title: 'Sommer',
      createdById: 'google-id',
      createdAt: new Date().toISOString(),
    });
    const fixture = await render();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.value = '  Sommer  ';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    fixture.nativeElement
      .querySelector('form')
      .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await fixture.whenStable();
    fixture.detectChanges();
    expect(galleries.create).toHaveBeenCalledExactlyOnceWith('Sommer');
    expect(fixture.nativeElement.querySelector('.gallery-card').textContent).toContain('Sommer');
    expect(input.value).toBe('');
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
});
