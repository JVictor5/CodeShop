import {
  CanActivateFn,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const recoverpassGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const user = authService.getUser();

  if (user) {
    router.navigate(['/']);
    return false;
  }

  const code = route.queryParamMap.get('code');
  const time = route.queryParamMap.get('time');

  if (!code || !time) {
    router.navigate(['/']);
    return false;
  }

  return true;
};
