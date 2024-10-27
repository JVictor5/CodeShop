import { Injectable } from '@angular/core';
import { CartItem } from '../interfaces/shopping-cart.interface';
import { BehaviorSubject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  cart$ = this.cartSubject.asObservable();

  private totalPriceSubject = new BehaviorSubject<number>(0);
  totalPrice$ = this.totalPriceSubject.asObservable();

  constructor(private toastr: ToastrService) {
    this.loadCart();
  }

  private saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
    this.cartSubject.next(this.cart);
    this.updateTotalPrice();
  }

  private loadCart() {
    const cart = localStorage.getItem('cart');
    if (cart) {
      this.cart = JSON.parse(cart);
      this.cartSubject.next(this.cart);
      this.updateTotalPrice();
    }
  }

  addItem(item: CartItem) {
    if (item.maximumQuantity <= 0) {
      this.toastr.error('Produto Indisponível', 'Erro', {
        closeButton: true,
      });
      return;
    }
    const existingItem = this.cart.find((cartItem) => cartItem.id === item.id);
    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      this.cart.push(item);
    }
    this.saveCart();
  }

  removeItem(itemId: string) {
    this.cart = this.cart.filter((item) => item.id !== itemId);
    this.saveCart();
  }

  clearCart() {
    this.cart = [];
    this.saveCart();
  }

  increaseQuantity(itemId: string) {
    const item = this.cart.find((cartItem) => cartItem.id === itemId);
    if (item) {
      if (item.maximumQuantity > item.quantity) {
        item.quantity += 1;
        this.saveCart();
      }
    }
  }

  decreaseQuantity(itemId: string) {
    const item = this.cart.find((cartItem) => cartItem.id === itemId);
    if (item && item.quantity > 1) {
      item.quantity -= 1;
      this.saveCart();
    }
  }

  private updateTotalPrice() {
    const totalPrice = this.cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    this.totalPriceSubject.next(totalPrice);
  }

  getPaymentDetails() {
    const products = this.cart.map((item) => ({
      idProd: item.id,
      quantity: item.quantity,
      price: item.price,
      status: 'Comprado',
    }));
    const precoTotal = this.totalPriceSubject.getValue().toString();

    return {
      products,
      precoTotal,
    };
  }
}
