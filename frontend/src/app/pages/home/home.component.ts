import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models/product';
import { CarouselModule } from 'primeng/carousel';
import { FavoriteProdutsService } from '../../core/services/favoriteProducts.service';
import { AuthService } from '../../core/services/auth.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CartService } from '../../core/services/shoppingCart.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, CarouselModule, ToastModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [MessageService],
})
export class HomeComponent {
  recentProducts: Product[] = [];
  userId: string = '';
  favoriteProductIds: Set<string> = new Set();

  responsiveOptions = [
    {
      breakpoint: '1705px',
      numVisible: 5,
      numScroll: 3,
    },
    {
      breakpoint: '1400px',
      numVisible: 4,
      numScroll: 2,
    },
    {
      breakpoint: '1120px',
      numVisible: 3,
      numScroll: 1,
    },
    {
      breakpoint: '870px',
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: '605px',
      numVisible: 1,
      numScroll: 1,
    },
  ];

  constructor(
    private productService: ProductService,
    private favoriteProductsService: FavoriteProdutsService,
    private authService: AuthService,
    private messageService: MessageService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadRecentProducts();
    this.authService.currentUser.subscribe(async (user) => {
      if (user) {
        this.userId = user.uid;
        this.loadFavoriteProducts();
      }
    });
  }

  async loadRecentProducts() {
    this.recentProducts = await this.productService.getRecentProducts();
    this.updateFavoriteIcons();
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

  showToast(severity: string, summary: string, detail: string) {
    this.messageService.add({
      severity: severity,
      summary: summary,
      detail: detail,
    });
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

  updateFavoriteIcons() {
    this.recentProducts.forEach((product) => {
      product.isFavorite = this.favoriteProductIds.has(product.id);
    });
  }
}
