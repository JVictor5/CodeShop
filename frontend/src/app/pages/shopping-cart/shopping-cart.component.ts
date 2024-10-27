import { Component } from '@angular/core';
import { CartService } from '../../core/services/shoppingCart.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    FloatLabelModule,
    InputTextModule,
    FormsModule,
    RouterLink,
  ],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.scss',
})
export class ShoppingCartComponent {
  cartItems$ = this.cartService.cart$;
  totalPrice$ = this.cartService.totalPrice$;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {}

  getDescriptionText(description: any[], maxLength: number): string {
    const text = description.map((desc) => desc.name).join(', ');
    return text.length > maxLength
      ? text.substring(0, maxLength) + '...'
      : text;
  }
  increaseQuantity(itemId: string) {
    this.cartService.increaseQuantity(itemId);
  }

  decreaseQuantity(itemId: string) {
    this.cartService.decreaseQuantity(itemId);
  }

  removeItem(itemId: string) {
    this.cartService.removeItem(itemId);
  }

  clearCart() {
    this.cartService.clearCart();
  }
}
