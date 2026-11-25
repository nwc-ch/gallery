import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authenticatedGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  try {
    return (await auth.loadUser()) ? true : router.createUrlTree(['/login']);
  } catch {
    return router.createUrlTree(['/login'], { queryParams: { error: 'unavailable' } });
  }
};

export const guestGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  try {
    return (await auth.loadUser()) ? router.createUrlTree(['/dashboard']) : true;
  } catch {
    return true;
  }
};
