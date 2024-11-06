import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuthenticated = authService.isAuthenticated();
  const routePath = route.routeConfig?.path;

  if (isAuthenticated && routePath === 'login') {
    router.navigate(['/']);
    return false;
  }

  if (!isAuthenticated && routePath === 'perfil') {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
