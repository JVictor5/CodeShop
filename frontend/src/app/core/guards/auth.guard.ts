import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { CartService } from '../services/shoppingCart.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const cartService = inject(CartService);
  const router = inject(Router);

  const isAuthenticated = authService.isAuthenticated();
  const routePath = route.routeConfig?.path;
  const cart = cartService.getTotalQuantity();

  if (isAuthenticated && routePath === 'login') {
    router.navigate(['/']);
    return false;
  }

  if (!isAuthenticated && routePath === 'perfil') {
    router.navigate(['/login']);
    return false;
  }

  if (routePath === 'carrinho/pagamento/cartao') {
    if (!isAuthenticated) {
      router.navigate(['/login']);
      return false;
    }

    if (isAuthenticated && cart === 0) {
      router.navigate(['/']);
      return false;
    }
  }

  return true;
};
