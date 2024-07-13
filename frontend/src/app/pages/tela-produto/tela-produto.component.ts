import { Component, inject } from '@angular/core';
import { ProductRepository } from '../../core/repositories/product.repository';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-tela-produto',
  standalone: true,
  imports: [NgFor],
  templateUrl: './tela-produto.component.html',
  styleUrl: './tela-produto.component.scss',
})
export class TelaProdutoComponent {
  products: any[] = [];

  private productRepository = inject(ProductRepository);

  ngOnInit() {
    this.productRepository.getAll().then((data: any[]) => {
      console.log(data);
      this.products = data;
    });
  }
}
