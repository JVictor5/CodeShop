import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { ShopService } from '../../core/services/shop.service';
import { ProductService } from '../../core/services/product.service';
import { FavoriteProdutsService } from '../../core/services/favoriteProducts.service';
import { CartService } from '../../core/services/shoppingCart.service';
import { MessageService } from 'primeng/api';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { DialogModule } from 'primeng/dialog';
import { ImgService } from '../../core/services/img.service';
import { CompanyRepository } from '../../core/repositories/company.repository';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-my-shop',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TieredMenuModule,
    DialogModule,
    InputTextModule,
    FloatLabelModule,
    ReactiveFormsModule,
    ToastModule,
    TooltipModule,
  ],
  templateUrl: './my-shop.component.html',
  styleUrls: ['./my-shop.component.scss'],
  providers: [MessageService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MyShopComponent implements OnInit {
  avatar: string | null = '';
  shopName: string = '';
  shopPhone: string = '';
  shopEmail: string = '';
  shopDiscription: string = '';
  products: any[] = [];
  existsProduct: boolean = false;
  userId: string = '';
  favoriteProductIds: Set<string> = new Set();
  userShop: string = '';
  selectedFile: File | null = null;
  storeId: string = '';

  isEditing = false;
  statusProductDialogVisible = false;
  selectedProductId: string | null = null;
  prodIsActive!: boolean;

  private productService = inject(ProductService);
  private favoriteProductsService = inject(FavoriteProdutsService);
  private cartService = inject(CartService);
  private messageService = inject(MessageService);
  private companyRepository = inject(CompanyRepository);
  private builder = inject(NonNullableFormBuilder);
  constructor(
    private route: ActivatedRoute,
    private titleService: Title,
    private shopService: ShopService,
    private authService: AuthService,
    private imgService: ImgService,
    private router: Router
  ) {}

  form = this.builder.group({
    idUser: ['', []],
    name: ['', []],
    email: ['', [Validators.email]],
    discription: ['', []],
    phone: ['', [Validators.pattern(/\d{10,11}$/)]],
  });

  get f() {
    return this.form.controls;
  }
  get fValue() {
    return this.form.getRawValue();
  }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(async (user) => {
      if (user) {
        this.userId = user.uid;
        this.loadFavoriteProducts();
      }
    });
    this.route.paramMap.subscribe((params) => {
      const url = this.router.url;
      let isShop: boolean;
      if (url.includes('/perfil')) {
        isShop = true;
      } else {
        isShop = false;
      }
      const storeId = params.get('idShop');
      if (storeId) {
        this.shopService
          .getById(storeId)
          .then((company) => {
            this.storeId = storeId;
            this.avatar = company.avatar;
            this.shopName = company.name;
            this.shopPhone = company.phone;
            this.shopEmail = company.email;
            this.userShop = company.idUser;
            this.shopDiscription = company.discription;
            this.titleService.setTitle(this.shopName);
            if (isShop) {
              this.loadProductsByStore(storeId);
            } else {
              this.loadProductsByStoreProdActive(storeId);
            }

            this.form.patchValue({
              idUser: company.idUser,
              name: company.name,
              email: company.email,
              discription: company.discription,
              phone: company.phone,
            });
          })
          .catch(() => {
            this.shopName = '';
          });
      }
    });
  }

  async loadFavoriteProducts() {
    if (this.userId) {
      this.favoriteProductsService
        .getFavoritesByUser(this.userId)
        .subscribe((favorites) => {
          this.favoriteProductIds = new Set(
            favorites.map((fav) => fav.productId)
          );
          this.updateFavoriteIcons();
        });
    }
  }
  async loadProductsByStore(storeId: string) {
    this.productService.getByIdShop(storeId).then((data: any[]) => {
      if (data.length > 0) {
        this.products = data;
        this.existsProduct = true;
        this.checkFavorites(data);
      }
    });
  }
  async loadProductsByStoreProdActive(storeId: string) {
    this.productService.getByIdShopProdActive(storeId).then((data: any[]) => {
      if (data.length > 0) {
        this.products = data;
        this.existsProduct = true;
        this.checkFavorites(data);
      }
    });
  }

  async checkFavorites(products: any[]) {
    if (!this.userId) {
      return;
    }
    const favorites = await firstValueFrom(
      this.favoriteProductsService.getFavoritesByUser(this.userId)
    );
    products.forEach((product) => {
      if (favorites.some((fav) => fav.productId === product.id)) {
        product.isFavorite = true;
      }
    });
  }

  toggleFavorite(product: any) {
    if (this.userId) {
      product.isFavorite = !product.isFavorite;
      if (product.isFavorite) {
        this.favoriteProductsService.addFavorito(this.userId, product.id);
        this.showToast(
          'success',
          'Favorited',
          'Produto adicionado aos favoritos!'
        );
      } else {
        this.favoriteProductsService.deleteFavorito(this.userId, product.id);
        this.showToast('info', 'Removed', 'Produto removido dos favoritos.');
      }
    } else {
      this.showToast(
        'error',
        'Atenção',
        'É preciso acessar sua conta para favoritar um produto.'
      );
    }
  }

  showToast(severity: string, summary: string, detail: string) {
    this.messageService.add({
      severity: severity,
      summary: summary,
      detail: detail,
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
      type: product.category,
    });
  }

  toggleHover(product: any, isHovering: boolean) {
    product.isHovered = isHovering;
  }
  updateFavoriteIcons() {
    this.products.forEach((product) => {
      product.isFavorite = this.favoriteProductIds.has(product.id);
    });
  }

  async openDeleteDialog(productId: string) {
    this.selectedProductId = productId;
    const prodInfo = await this.productService.getById(productId);
    this.prodIsActive = prodInfo.status;
    this.statusProductDialogVisible = true;
  }

  confirmToggleStatusProduct() {
    if (this.selectedProductId) {
      this.toggleStatusProduct(this.selectedProductId);
    }
    this.statusProductDialogVisible = false;
  }

  toggleStatusProduct(id: string) {
    const newStatus = !this.prodIsActive;
    this.productService.update({
      id,
      status: newStatus,
    });
    this.showToast('success', 'Sucesso', 'Status do produto atualizado.');
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }
  async uploadFile() {
    if (this.selectedFile) {
      try {
        const avatarUrl = await this.imgService.uploadSellerMedia(
          this.storeId,
          'avatar',
          this.selectedFile
        );
        if (avatarUrl) {
          const id = this.storeId;
          await this.companyRepository.update({
            id,
            avatar: avatarUrl,
          });
        }
        window.location.reload();
      } catch (error) {
        console.error('Erro ao fazer o upload:', error);
      }
    }
  }

  async update() {
    try {
      await this.shopService.update(this.storeId, this.fValue);
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  }

  onCloseModal() {
    this.isEditing = false;
  }
  openModal() {
    this.isEditing = true;
  }
}
