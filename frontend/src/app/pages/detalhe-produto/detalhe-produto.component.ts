import { Component } from '@angular/core';
import { ProductService } from '../../core/services/product.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detalhe-produto',
  standalone: true,
  imports: [],
  templateUrl: './detalhe-produto.component.html',
  styleUrl: './detalhe-produto.component.scss',
})
export class DetalheProdutoComponent {
  productId: string = '';
  infoProduto: any = {};

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.productId = params.get('id') ?? '';
      this.loadProduct();
    });
  }

  async loadProduct() {
    if (this.productId) {
      try {
        const product = await this.productService.getById(this.productId);
        this.infoProduto = product;
        console.log('aqui:', this.infoProduto);
      } catch (error) {
        console.error('Erro ao carregar o produto:', error);
      }
    }
  }
}
