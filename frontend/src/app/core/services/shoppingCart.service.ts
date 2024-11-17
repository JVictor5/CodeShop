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

  private totalQuantitySubject = new BehaviorSubject<number>(0);
  totalQuantity$ = this.totalQuantitySubject.asObservable();

  constructor(private toastr: ToastrService) {
    this.loadCart();
  }

  private saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
    this.cartSubject.next(this.cart);
    this.updateTotalPrice();
    this.updateTotalQuantity();
  }

  private loadCart() {
    const cart = localStorage.getItem('cart');
    if (cart) {
      this.cart = JSON.parse(cart);
      this.cartSubject.next(this.cart);
      this.updateTotalPrice();
      this.updateTotalQuantity();
      console.log(this.cart);
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
      const totalQuantity = existingItem.quantity + item.quantity;

      if (totalQuantity > item.maximumQuantity) {
        this.toastr.error(
          `Você já tem este produto no carrinho e atingiu a quantidade máxima em estoque.`,
          'Erro',
          {
            closeButton: true,
          }
        );
        return;
      }

      existingItem.quantity += item.quantity;
    } else {
      if (item.quantity > item.maximumQuantity) {
        this.toastr.error(
          `Produto Indisponível. Quantidade máxima em estoque foi atingida.`,
          'Erro',
          {
            closeButton: true,
            timeOut: 1000,
          }
        );
        return;
      }
      this.toastr.success(
        `Produto adicionado ao carrinho com sucesso!`,
        'Sucesso',
        {
          closeButton: true,
          timeOut: 500,
        }
      );
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

  private updateTotalQuantity() {
    const totalQuantity = this.cart.reduce(
      (total, item) => total + item.quantity,
      0
    );
    this.totalQuantitySubject.next(totalQuantity);
  }

  getTotalQuantity(): number {
    return this.totalQuantitySubject.getValue();
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
