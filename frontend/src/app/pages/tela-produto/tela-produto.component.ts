import {
  Component,
  ElementRef,
  HostListener,
  inject,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ProductRepository } from '../../core/repositories/product.repository';
import { CommonModule, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/shoppingCart.service';

@Component({
  selector: 'app-tela-produto',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './tela-produto.component.html',
  styleUrl: './tela-produto.component.scss',
  encapsulation: ViewEncapsulation.Emulated,
})
export class TelaProdutoComponent implements OnInit {
  products: any[] = [];

  private productRepository = inject(ProductRepository);

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.productRepository.getAll().then((data: any[]) => {
      this.products = data;
    });
  }
  toggleFavorite(product: any) {
    product.isFavorite = !product.isFavorite;

    const heartIcon = document.querySelector(`.heart-icon-${product.id}`);
    if (heartIcon) {
      if (product.isFavorite) {
        heartIcon.classList.add('active');
      } else {
        heartIcon.classList.remove('active');
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
    });
    console.log(product.description);
  }

  toggleHover(product: any, isHovering: boolean) {
    product.isHovered = isHovering;
  }

  // Filtro
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
