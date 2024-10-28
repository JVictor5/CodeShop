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
import { AuthService } from '../../core/services/auth.service';
import { firstValueFrom } from 'rxjs';
import { FavoriteProdutsService } from '../../core/services/favoriteProducts.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-detalhe-produto',
  standalone: true,
  imports: [NgFor, NgIf, CommonModule, DividerModule, ToastModule],
  templateUrl: './detalhe-produto.component.html',
  styleUrl: './detalhe-produto.component.scss',
  providers: [MessageService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DetalheProdutoComponent {
  @ViewChild('colorDivRef', { static: false }) colorDivRef!: ElementRef;
  @ViewChild('cardHeaderDestaqueRef', { static: false }) cardHeaderDestaqueRef!: ElementRef;

  userId: string = '';
  textFavorite: string = 'Adicionar';
  isFavoriteProduct: boolean = false;
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
    private companyRepository: CompanyRepository,
    private authService: AuthService,
    private favoriteProductsService: FavoriteProdutsService,
    private messageService: MessageService
  ) {}
  async ngOnInit(): Promise<void> {
    this.route.paramMap.subscribe(async (params) => {
      this.productId = params.get('id') ?? '';
      await this.loadProduct();
      this.applyColorToDiv();
      this.infoSeller = await this.companyRepository.getById(this.infoProduto.idUser);
    });

    this.authService.currentUser.subscribe(async (user) => {
      if (user) {
        this.userId = user.uid;
      }
    });
  }

  async loadProduct() {
    if (this.productId) {
      try {
        const product = await this.productService.getById(this.productId);
        this.infoProduto = product; 
        this.isFavorite();  
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

  toggleFavorite() {
      if (this.userId) {
        if (!this.isFavoriteProduct) {
          this.favoriteProductsService.addFavorito(this.userId, this.productId);
          this.textFavorite = 'Remover';
          this.isFavoriteProduct = true;
        } else {
          this.favoriteProductsService.deleteFavorito(this.userId, this.productId);
          this.textFavorite = 'Adicionar';
          this.isFavoriteProduct = false;
        }
      } else {
        this.showToast('error', 'Atenção', 'É preciso acessar sua conta para favoritar um produto.');
      }
  }

  async isFavorite() {
    if (!this.userId) {
      return;
    }
    const favorites = await firstValueFrom(this.favoriteProductsService.getFavoritesByUser(this.userId));
    if (favorites.some(fav => fav.productId === this.productId)) {
      this.textFavorite = 'Remover';
      this.isFavoriteProduct = true;
    };
  }

  /**
   * Função destinada a mostrar os pop-ups.
   * @param severity gravidade da mensagem que implica no tema do pop-up
   * @param summary Título
   * @param detail Descrição
   */
  showToast(severity: string, summary: string, detail: string) {
    this.messageService.add({ severity: severity, summary: summary, detail: detail });
  }
}
