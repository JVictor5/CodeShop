import { Component, inject, Input } from '@angular/core';
import { FavoriteProdutsService } from '../../core/services/favoriteProducts.service';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/shoppingCart.service';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { Product } from '../../core/models/product';


@Component({
  selector: 'app-card-product',
  imports: [CommonModule, RouterModule, ToastModule],
  templateUrl: './card-poduct.component.html',
  styleUrl: './card-poduct.component.scss',
})
export class CardProductComponent {
  private favoriteProductsService = inject(FavoriteProdutsService);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);
  private cartService = inject(CartService);

  @Input() product!: Product;
  userId: string = '';
  favoriteProductIds: Set<string> = new Set();

  ngOnInit(): void {
    this.authService.currentUser.subscribe(async (user) => {
      if (user) {
        this.userId = user.uid;
        this.loadFavoriteProducts();
      }
    });
  }

  showToast(severity: string, summary: string, detail: string) {
    this.messageService.add({
      severity: severity,
      summary: summary,
      detail: detail,
    });
  }

  async loadFavoriteProducts() {
    if (this.userId) {
      this.favoriteProductsService
        .getFavoritesByUser(this.userId)
        .subscribe((favorites) => {
          this.favoriteProductIds = new Set(
            favorites.map((fav) => fav.productId)
          );
          this.updateFavoriteIcons();
        });
    }
  }

  toggleHover(product: any, isHovering: boolean) {
    product.isHovered = isHovering;
  }
  updateFavoriteIcons() {
    this.product.isFavorite = this.favoriteProductIds.has(this.product.id);
  }

  toggleFavorite(product: any) {
    const heartIcon = document.querySelector(`.heart-icon-${product.id}`);

    if (heartIcon) {
      if (this.userId) {
        product.isFavorite = !product.isFavorite;
        if (product.isFavorite) {
          this.favoriteProductsService.addFavorito(this.userId, product.id);
          heartIcon.classList.add('active');
          this.favoriteProductIds.add(product.id); // Adiciona o produto aos favoritos
        } else {
          this.favoriteProductsService.deleteFavorito(this.userId, product.id);
          heartIcon.classList.remove('active');
          this.favoriteProductIds.delete(product.id); // Remove o produto dos favoritos
        }
      } else {
        this.showToast(
          'error',
          'Atenção',
          'É preciso acessar sua conta para favoritar um produto.'
        );
      }
    } else {
      console.warn('Elemento heartIcon não encontrado!');
    }
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
}

