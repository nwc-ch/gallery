import { Routes } from '@angular/router';
import { authenticatedGuard, guestGuard } from './auth/auth.guards';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./login/login').then((m) => m.Login),
  },
  {
    path: 'dashboard',
    canActivate: [authenticatedGuard],
    loadComponent: () => import('./dashboard/dashboard').then((m) => m.Dashboard),
  },
  {
    path: 'galleries/:id',
    canActivate: [authenticatedGuard],
    loadComponent: () => import('./gallery/gallery-page').then((m) => m.GalleryPage),
  },
  { path: '**', redirectTo: 'login' },
];
