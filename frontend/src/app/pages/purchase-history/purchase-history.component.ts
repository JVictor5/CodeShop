import { Component } from '@angular/core';
import { PaymentService } from '../../core/services/payment.service';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../core/services/product.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-purchase-history',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './purchase-history.component.html',
  styleUrl: './purchase-history.component.scss',
})
export class PurchaseHistoryComponent {
  userId: string = '';
  pagamentos: any[] = [];
  constructor(
    private authService: AuthService,
    private pagamentoService: PaymentService,
    private productService: ProductService
  ) {}
  ngOnInit(): void {
    this.authService.currentUser.subscribe(async (user) => {
      if (user) {
        this.userId = user.uid;
        this.loadUserPayments();
      } else {
        this.userId = '';
      }
    });
  }
  async loadUserPayments() {
    if (this.userId) {
      const allPayments = (await this.pagamentoService.getAll()) as any[];

      this.pagamentos = allPayments.filter(
        (payment) => payment.idUser === this.userId
      );

      this.pagamentos.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA;
      });

      await Promise.all(
        this.pagamentos.map(async (pagamento) => {
          const produtosComDetalhes = await Promise.all(
            pagamento.idProd.map(
              async (produto: { idProd: string; quantity: number }) => {
                const productDetails = await this.productService.getById(
                  produto.idProd
                );
                return {
                  ...produto,
                  name: productDetails?.name || 'Nome não disponível',
                  img:
                    productDetails?.capaUrl?.sm ||
                    'URL da imagem não disponível',
                };
              }
            )
          );
          pagamento.idProd = produtosComDetalhes;
        })
      );
    }
  }
}
