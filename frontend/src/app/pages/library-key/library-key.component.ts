import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { ProductService } from '../../core/services/product.service';
import { KeyService } from '../../core/services/key.service';
import { ToastrService } from 'ngx-toastr';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-library-key',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule],
  templateUrl: './library-key.component.html',
  styleUrls: ['./library-key.component.scss'],
})
export class LibraryKeyComponent {
  userId: string = '';
  showCodes: boolean = false;
  products: any[] = [];
  refundDialogVisible = false;
  revealDialogVisible = false;
  selectedCode: any = null;

  constructor(
    private keyService: KeyService,
    private authService: AuthService,
    private productService: ProductService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe(async (user) => {
      if (user) {
        this.userId = user.uid;
        this.loadUserCodes();
      } else {
        this.userId = '';
      }
    });
  }

  async loadUserCodes() {
    if (this.userId) {
      const data: any[] = (await this.keyService.getAll()) as any[];
      const userProducts = data.filter(
        (product) => product.userId === this.userId
      );

      this.products = await Promise.all(
        userProducts.map(async (product) => {
          const productDetails = await this.productService.getById(
            product.productId
          );
          return {
            ...product,
            name: productDetails.name,
            img: productDetails.capaUrl.sm,
            createdAt: product.createdAt,
          };
        })
      );
      this.products.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      if (this.products.length > 0) {
        console.log('Produtos encontrados para o usuário:', this.products);
      } else {
        console.log('Nenhum produto encontrado para o usuário:', this.userId);
      }
    } else {
      console.log('Nenhum userId disponível.');
    }
  }

  toggleShowCodes() {
    this.showCodes = !this.showCodes;
  }

  openRevealDialog(code: any) {
    this.selectedCode = code;
    this.revealDialogVisible = true;
  }

  openRefundDialog(code: any) {
    this.selectedCode = code;
    this.refundDialogVisible = true;
  }

  confirmRevealCode() {
    this.revealCode(this.selectedCode);
    this.revealDialogVisible = false;
    this.selectedCode = null;
  }

  confirmRefundCode() {
    this.refundCode(this.selectedCode);
    this.refundDialogVisible = false;
    this.selectedCode = null;
  }

  revealCode(code: any) {
    code.revealed = true;
    code.status = 'seeCode';
    this.keyService.update({
      id: code.id,
      status: code.status,
    });
  }

  async refundCode(code: any) {
    if (this.userId) {
      try {
        await this.keyService.refundCode(code.id);
        this.products = this.products.filter((p) => p.id !== code.id);
        this.toastr.success('Reembolso concluído para o código', 'Sucesso', {
          closeButton: true,
        });
        console.log(':', code.code);
      } catch (error) {
        this.toastr.error(`Erro ao reembolsar o código: ${error}`, 'Erro', {
          closeButton: true,
        });
      }
    }
  }

  copyCode(code: string): void {
    navigator.clipboard
      .writeText(code)
      .then(() =>
        this.toastr.success('Código copiado com sucesso!', 'Sucesso', {
          closeButton: true,
        })
      )
      .catch(() =>
        this.toastr.error(
          'Erro ao copiar o código. Por favor, tente novamente.',
          'Erro',
          { closeButton: true }
        )
      );
  }
}
