import {
  Component,
  ElementRef,
  HostListener,
  inject,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ProductService } from '../../core/services/product.service';
import { CommonModule, NgFor } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { CartService } from '../../core/services/shoppingCart.service';
import { FavoriteProdutsService } from '../../core/services/favoriteProducts.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { firstValueFrom } from 'rxjs';
import { gameGenres } from '../../data/game-genres';

@Component({
  selector: 'app-tela-produto',
  standalone: true,
  imports: [CommonModule, RouterLink, ToastModule],
  templateUrl: './tela-produto.component.html',
  styleUrl: './tela-produto.component.scss',
  providers: [MessageService],
  encapsulation: ViewEncapsulation.Emulated,
})
export class TelaProdutoComponent implements OnInit {
  products: any[] = [];
  existsProduct: boolean = false;
  userId: string = '';
  gameGenres = gameGenres;

  private productService = inject(ProductService);
  private favoriteProductsService = inject(FavoriteProdutsService);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);

  constructor(
    private cartService: CartService,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    this.route.paramMap.subscribe(async (params) => {
      const category = params.get('category') ?? '';
      const name = params.get('name') ?? '';
      const genderCode = params.get('gender') ?? '';
      if (category) {
        await this.loadProductsByCategory(category);
      } else if (name) {
        await this.loadProductsByName(name);
      } else if (genderCode) {
        let genderName = '';
        gameGenres.forEach((g) => {
          if (g.code == genderCode) {
            genderName = g.name;
          }
        });
        await this.loadProductsByGameGender(genderCode, genderName);
      }
    });

    this.authService.currentUser.subscribe(async (user) => {
      if (user) {
        this.userId = user.uid;
      }
    });
  }

  async loadProductsByCategory(category: string) {
    this.productService.getByCategory(category).then((data: any[]) => {
      if (data.length > 0) {
        this.products = data;
        this.existsProduct = true;
        this.checkFavorites(data);
      }
    });
  }

  async loadProductsByName(name: string) {
    this.productService.getByName(name).then((data: any[]) => {
      if (data.length > 0) {
        this.products = data;
        this.existsProduct = true;
        this.checkFavorites(data);
      }
    });
  }

  async loadProductsByGameGender(genderCode: string, genderName: string) {
    this.productService
      .getByGameGender(genderCode, genderName)
      .then((data: any[]) => {
        if (data.length > 0) {
          this.products = data;
          this.existsProduct = true;
          this.checkFavorites(data);
        }
      });
  }

  async checkFavorites(products: any[]) {
    if (!this.userId) {
      return;
    }
    const favorites = await firstValueFrom(
      this.favoriteProductsService.getFavoritesByUser(this.userId)
    );
    products.forEach((product) => {
      if (favorites.some((fav) => fav.productId === product.id)) {
        product.isFavorite = true;
      }
    });
  }

  toggleFavorite(product: any) {
    if (this.userId) {
      product.isFavorite = !product.isFavorite;
      if (product.isFavorite) {
        this.favoriteProductsService.addFavorito(this.userId, product.id);
        this.showToast(
          'success',
          'Favorited',
          'Produto adicionado aos favoritos!'
        );
      } else {
        this.favoriteProductsService.deleteFavorito(this.userId, product.id);
        this.showToast('info', 'Removed', 'Produto removido dos favoritos.');
      }
    } else {
      this.showToast(
        'error',
        'Atenção',
        'É preciso acessar sua conta para favoritar um produto.'
      );
    }
  }

  showToast(severity: string, summary: string, detail: string) {
    this.messageService.add({
      severity: severity,
      summary: summary,
      detail: detail,
    });
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
    });
    console.log(product.description);
  }

  toggleHover(product: any, isHovering: boolean) {
    product.isHovered = isHovering;
  }

  @ViewChild('filtro', { static: true }) filtro!: ElementRef<HTMLDivElement>;

  private originalHeight = '100vh';
  private newHeight = '95vh';

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollPosition + windowHeight >= documentHeight) {
      this.filtro.nativeElement.style.height = this.newHeight;
    } else {
      this.filtro.nativeElement.style.height = this.originalHeight;
    }
  }
}
