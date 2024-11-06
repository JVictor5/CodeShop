import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { UserRepository } from '../repositories/user.repository';

export const shopGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const productService = inject(ProductService);
  const userRepository = inject(UserRepository);

  const user = authService.getUser();
  if (!user) {
    router.navigate(['/']);
    return false;
  }

  const userFromApi = await userRepository.getById(`${user.uid}`);
  if (!userFromApi) {
    router.navigate(['/']);
    return false;
  }

  if (userFromApi.nivel !== 2) {
    router.navigate(['/']);
    return false;
  }

  const productId = route.paramMap.get('id');
  if (productId) {
    const product = await productService.getById(productId);
    if (!product) {
      router.navigate(['/']);
      return false;
    }

    if (product.idUser === userFromApi.idShop) {
      return true;
    } else {
      router.navigate(['/']);
      return false;
    }
  }

  return true;
};
