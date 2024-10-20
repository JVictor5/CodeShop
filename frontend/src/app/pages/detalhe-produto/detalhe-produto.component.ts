import { NgFor, NgIf, CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { DividerModule } from 'primeng/divider';
import { FastAverageColor } from 'fast-average-color';
import { CompanyRepository } from '../../core/repositories/company.repository';

@Component({
  selector: 'app-detalhe-produto',
  standalone: true,
  imports: [NgFor, NgIf, CommonModule, DividerModule],
  templateUrl: './detalhe-produto.component.html',
  styleUrl: './detalhe-produto.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DetalheProdutoComponent {
  @ViewChild('colorDivRef', { static: false }) colorDivRef!: ElementRef;
  @ViewChild('cardHeaderDestaqueRef', { static: false }) cardHeaderDestaqueRef!: ElementRef;

  infoSeller: any;
  predominantColor: string = '';
  productId: string = '';
  infoProduto: any = {
    name: '',
    description: '',
    price: '',
    quantity: '',
    capaUrl: { sm: '', lg: '' },
    videosUrls: [],
    imgUrls: { sm: [''], lg: [''] },
    category: '',
    genres: [''],
    keys: [''],
    minimumSystemRequirements: {
      os: '',
      cpu: '',
      storage: '',
      memory: '',
      gpu: '',
    },
    recommendedSystemRequirements: {
      os: '',
      cpu: '',
      storage: '',
      memory: '',
      gpu: '',
    },
    releaseDate: {
      bruteFormat: '',
      dateFormat: ''
    }
  };
  thumbnails: string[] = [];
  time = 0;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private companyRepository: CompanyRepository
  ) {}
  async ngOnInit(): Promise<void> {
    this.route.paramMap.subscribe(async (params) => {
      this.productId = params.get('id') ?? '';
      await this.loadProduct();
      this.applyColorToDiv();
      this.infoSeller = await this.companyRepository.getById(this.infoProduto.idUser);
    });
  }

  async loadProduct() {
    if (this.productId) {
      try {
        const product = await this.productService.getById(this.productId);
        this.infoProduto = product;   
      } catch (error) {
        console.error('Erro ao carregar o produto:', error);
      }
    }
  }

  applyColorToDiv() {
    const fac = new FastAverageColor();
    fac.getColorAsync(this.infoProduto.capaUrl.sm)
        .then(color => {
            this.colorDivRef.nativeElement.style.backgroundColor = color.rgba;
            this.colorDivRef.nativeElement.style.color = color.isDark ? '#fff' : '#000';
            this.cardHeaderDestaqueRef.nativeElement.style.backgroundColor = color.rgba;
            this.cardHeaderDestaqueRef.nativeElement.style.color = color.isDark ? '#fff' : '#000';
            this.predominantColor = color.rgba;
        })
        .catch(e => {
            console.log(e);
        });
  }

  formatTextDescription(text: string) {
    if (typeof text == 'string') {
      return text.replace(/\n/g, '<br>');
    }
    return '';
  }
}
