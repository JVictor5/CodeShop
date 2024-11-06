import { Component, inject } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { AuthService } from '../../core/services/auth.service';
import { UserRepository } from '../../core/repositories/user.repository';
import { ProductService } from '../../core/services/product.service';
import { FavoriteProdutsService } from '../../core/services/favoriteProducts.service';
import { PagamentoRepository } from '../../core/repositories/pagament.repository';

@Component({
  selector: 'app-graficos-seller',
  standalone: true,
  imports: [ChartModule],
  templateUrl: './graficos-seller.component.html',
  styleUrl: './graficos-seller.component.scss'
})
export class GraficosSellerComponent {
  private authService = inject(AuthService);
  private userRepository = inject(UserRepository);
  private productService = inject(ProductService);
  private favoriteProdutsService = inject(FavoriteProdutsService);
  private paymentRepository = inject(PagamentoRepository);

  idShop: string = '';
  dataFavoriteProducts: any;
  optionsFavoriteProducts: any;
  dataTypeFavoriteProducts: any;
  optionsTypeFavoriteProducts: any;
  dataPaymentProducts: any;
  optionsPaymentProducts: any;
  dataTypePaymentProducts: any;
  optionsTypePaymentProducts: any;

  async ngOnInit() {
    const user = await this.getCurrentUser();
    const userInfo = await this.userRepository.getById(user.uid);

    if (userInfo.idShop) {
      this.idShop = userInfo.idShop;
        
      await this.getFavoriteProductsData();
      await this.getTypeFavoriteProductsData();
      await this.getPaymentProductsData();
      await this.getTypePaymentProductsData();
    }
  }

  private getCurrentUser(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.authService.currentUser.subscribe(user => {
        if (user) {
          resolve(user);
        } else {
          reject('Usuário não encontrado.');
        }
      });
    });
  }

  generateColor(index: number, total: number): string {
    const hue = (index / total) * 360; // Gira o matiz para cada cor
    return `hsl(${hue}, 70%, 60%)`; // Saturação e luminosidade fixas para cores vivas
  }

  async getFavoriteProductsData() {
    const products = await this.productService.getByIdShop(this.idShop);
    const data: { name: string, count: number }[] = [];
    let loadedProduct = 0;

    products.forEach((p) => {
      this.favoriteProdutsService.getFavoritesByProduct(p.id).subscribe(favoriteProducts => {
        data.push({ name: p.name, count: favoriteProducts.length });
        loadedProduct++;
        
        if (loadedProduct == products.length) {
          this.setFavoriteChart(data);
        }
      });
    });
  }

  async setFavoriteChart(dataFavorite: { name: string, count: number }[]) {
    const totalItems = dataFavorite.length;

    const backgroundColors = dataFavorite.map((_, index) => this.generateColor(index, totalItems));
    const borderColors = backgroundColors.map(color => color.replace('60%', '50%')); // Escurece um pouco para a borda

    this.dataFavoriteProducts = {
      labels: dataFavorite.map(p => p.name),
      datasets: [
        {
          label: 'Produtos favoritos',
          data: dataFavorite.map(p => p.count),
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1
        }
      ]
    };

    this.optionsFavoriteProducts = {
      indexAxis: 'y',
      responsive: true,
      plugins: {
        legend: {
          position: 'top'
        },
      }
    };
  }

  async getTypeFavoriteProductsData() {
    const products = await this.productService.getByIdShop(this.idShop);
    const data: { [category: string]: { name: string, count: number } } = {};
    let loadedProduct = 0;

    products.forEach((p) => {
      this.favoriteProdutsService.getFavoritesByProduct(p.id).subscribe(favoriteProducts => {
        const count = favoriteProducts.length;
        const category: string = p.category;

        if (data[category]) {
          data[category].count += count;
        } else {
          data[category] = { name: p.category, count: count};
        }

        loadedProduct++;
        
        if (loadedProduct == products.length) {
          const array = Object.values(data);
          this.setTypeFavoriteChart(array);
        }
      });
    });
  }

  async setTypeFavoriteChart(dataFavorite: { name: string, count: number }[]) {
    const totalItems = dataFavorite.length;

    const backgroundColors = dataFavorite.map((_, index) => this.generateColor(index, totalItems));
    const borderColors = backgroundColors.map(color => color.replace('60%', '50%')); // Escurece um pouco para a borda

    this.dataTypeFavoriteProducts = {
      labels: dataFavorite.map(p => p.name),
      datasets: [
        {
          label: 'Tipos favoritos',
          data: dataFavorite.map(p => p.count),
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1
        }
      ]
    };

    this.optionsTypeFavoriteProducts = {
      indexAxis: 'y',
      responsive: true,
      plugins: {
        legend: {
          position: 'top'
        },
      }
    };
  }

  async getPaymentProductsData() {
    const products = await this.productService.getByIdShop(this.idShop);
    const data: { name: string, count: number }[] = [];
    let loadedProduct = 0;

    products.forEach((p) => {
      this.paymentRepository.getByIdProduct(p.id).subscribe(paymentProducts => {
        let count = 0;
        paymentProducts.forEach((pay) => {
          pay.idProd.forEach((payIdProd: any) => {
            if (payIdProd.idProd === p.id) {
              count += payIdProd.quantity
            }
          });
        });
        data.push({ name: p.name, count: count });
        loadedProduct++;
        
        if (loadedProduct == products.length) {
          this.setPaymentChart(data);
        }
      });
    });
  }

  async setPaymentChart(dataPayment: { name: string, count: number }[]) {
    const totalItems = dataPayment.length;

    const backgroundColors = dataPayment.map((_, index) => this.generateColor(index, totalItems));
    const borderColors = backgroundColors.map(color => color.replace('60%', '50%')); // Escurece um pouco para a borda

    this.dataPaymentProducts = {
      labels: dataPayment.map(p => p.name),
      datasets: [
        {
          label: 'Produtos vendidos',
          data: dataPayment.map(p => p.count),
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1
        }
      ]
    };

    this.optionsPaymentProducts = {
      indexAxis: 'y',
      responsive: true,
      plugins: {
        legend: {
          position: 'top'
        },
      }
    };
  }

  async getTypePaymentProductsData() {
    const products = await this.productService.getByIdShop(this.idShop);
    const data: { [category: string]: { name: string, count: number } } = {};
    let loadedProduct = 0;

    products.forEach((p) => {
      this.paymentRepository.getByIdProduct(p.id).subscribe(paymentProducts => {
        let count = 0;
        paymentProducts.forEach((pay) => {
          pay.idProd.forEach((payIdProd: any) => {
            if (payIdProd.idProd === p.id) {
              count += payIdProd.quantity
            }
          });
        });

        const category: string = p.category;
        if (data[category]) {
          data[category].count += count;
        } else {
          data[category] = { name: p.category, count: count};
        }

        loadedProduct++;
        
        if (loadedProduct == products.length) {
          const array = Object.values(data);
          this.setTypePaymentChart(array);
        }
      });
    });
  }

  async setTypePaymentChart(dataPayment: { name: string, count: number }[]) {
    const totalItems = dataPayment.length;

    const backgroundColors = dataPayment.map((_, index) => this.generateColor(index, totalItems));
    const borderColors = backgroundColors.map(color => color.replace('60%', '50%')); // Escurece um pouco para a borda

    this.dataTypePaymentProducts = {
      labels: dataPayment.map(p => p.name),
      datasets: [
        {
          label: 'Tipos de produtos vendidos',
          data: dataPayment.map(p => p.count),
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1
        }
      ]
    };

    this.optionsTypePaymentProducts = {
      indexAxis: 'y',
      responsive: true,
      plugins: {
        legend: {
          position: 'top'
        },
      }
    };
  }
}
