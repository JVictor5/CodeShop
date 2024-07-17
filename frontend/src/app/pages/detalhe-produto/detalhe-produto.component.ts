import { NgFor, NgIf } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../core/services/product.service';

@Component({
  selector: 'app-detalhe-produto',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './detalhe-produto.component.html',
  styleUrl: './detalhe-produto.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DetalheProdutoComponent {
  productId: string = '';
  infoProduto: any = {};
  thumbnails: string[] = [];
  time = 0;
  kek: string = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}
  async ngOnInit(): Promise<void> {
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
        this.kek = this.infoProduto.imgUrls[0];
        console.log('aqui:', this.infoProduto);
      } catch (error) {
        console.error('Erro ao carregar o produto:', error);
      }
    }
  }

}
