import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { FavoriteProdutsService } from '../../core/services/favoriteProducts.service';
import { ProductService } from '../../core/services/product.service';
import { forkJoin, switchMap } from 'rxjs';
import { RouterModule } from '@angular/router';
import { CartService } from '../../core/services/shoppingCart.service';

@Component({
  selector: 'app-wish-list',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './wish-list.component.html',
  styleUrl: './wish-list.component.scss',
})
export class WishListComponent {
  userId: string = '';
  products: any[] = [];

  constructor(
    private authService: AuthService,
    private favoriteProdutsService: FavoriteProdutsService,
    private productService: ProductService,
    private cartService: CartService
  ) {}
  ngOnInit(): void {
    this.authService.currentUser.subscribe(async (user) => {
      if (user) {
        this.userId = user.uid;
        this.loadUserWishList();
      } else {
        this.userId = '';
      }
    });
  }
  loadUserWishList(): void {
    this.favoriteProdutsService
      .getFavoritesByUser(this.userId)
      .pipe(
        switchMap((favorites) => {
          const requests = favorites.map((fav) =>
            this.productService.getById(fav.productId)
          );
          return forkJoin(requests);
        })
      )
      .subscribe(
        (products) => {
          this.products = products;
        },
        (error) => {
          console.error('Erro ao carregar os produtos favoritos:', error);
        }
      );
  }

  addToCart(product: any) {
    this.cartService.addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      capaUrl: product.capaUrl,
      quantity: 1,
      description: product.genres,
      maximumQuantity: product.quantity,
      type: product.category,
    });
  }
  removeFavorite(product: any) {
    this.favoriteProdutsService.deleteFavorito(this.userId, product.id);
  }
}
