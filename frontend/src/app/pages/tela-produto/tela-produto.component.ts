import { Component, inject, OnInit } from '@angular/core';
import { ProductRepository } from '../../core/repositories/product.repository';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/shoppingCart.service';

@Component({
  selector: 'app-tela-produto',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './tela-produto.component.html',
  styleUrl: './tela-produto.component.scss',
})
export class TelaProdutoComponent implements OnInit {
  products: any[] = [];

  private productRepository = inject(ProductRepository);

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.productRepository.getAll().then((data: any[]) => {
      console.log(data);
      this.products = data;
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
}
