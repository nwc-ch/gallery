import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { authenticatedGuard, guestGuard } from './auth.guards';

describe('authentication route guards', () => {
  const auth = { loadUser: vi.fn() };

  beforeEach(() => {
    auth.loadUser.mockReset();
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: AuthService, useValue: auth }],
    });
  });

  async function run(guard: typeof authenticatedGuard) {
    return await TestBed.runInInjectionContext(() => guard({} as never, {} as never));
  }

  it('redirects guests to the login page', async () => {
    auth.loadUser.mockResolvedValue(null);
    const result = await run(authenticatedGuard);
    expect(TestBed.inject(Router).serializeUrl(result as never)).toBe('/login');
  });

  it('allows an authenticated user to open the dashboard after reloading', async () => {
    auth.loadUser.mockResolvedValue({ id: 'google-id' });
    expect(await run(authenticatedGuard)).toBe(true);
  });

  it('redirects authenticated users from login to dashboard', async () => {
    auth.loadUser.mockResolvedValue({ id: 'google-id' });
    expect(TestBed.inject(Router).serializeUrl((await run(guestGuard)) as never)).toBe(
      '/dashboard',
    );
  });

  it('handles an unreachable backend without opening the dashboard', async () => {
    auth.loadUser.mockRejectedValue(new Error('offline'));
    expect(TestBed.inject(Router).serializeUrl((await run(authenticatedGuard)) as never)).toBe(
      '/login?error=unavailable',
    );
  });
});
