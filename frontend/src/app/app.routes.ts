import { Routes } from '@angular/router';
import { LayoutComponent } from './layouts/layout.component';
import { shopGuard } from './core/guards/shop.guard';
import { authGuard } from './core/guards/auth.guard';
import { recoverpassGuard } from './core/guards/recoverpass.guard';

export const routes: Routes = [
  {
    path: '',
    title: 'CodeShop',
    component: LayoutComponent,
    children: [
      {
        path: '',
        title: 'CodeShop',
        loadComponent: () =>
          import('./pages/home/home.component').then((c) => c.HomeComponent),
      },
      {
        path: 'login',
        title: 'Login',
        loadComponent: () =>
          import('./pages/cadastro-usuario/cadastro-usuario.component').then(
            (b) => b.CadastroUsuarioComponent
          ),
        canActivate: [authGuard],
      },
      {
        path: 'perfil',
        title: 'perfil',
        loadComponent: () =>
          import('./pages/perfil/perfil.component').then(
            (a) => a.PerfilComponent
          ),
        canActivate: [authGuard],
      },
      {
        path: 'loja/:id',
        title: 'Detalhe da Loja',
        loadComponent: () =>
          import('./pages/my-shop/my-shop.component').then(
            (v) => v.MyShopComponent
          ),
      },
      {
        path: 'trocar-senha',
        title: 'Troca de Senha',
        loadComponent: () =>
          import('./pages/recover-passoword/recover-passoword.component').then(
            (c) => c.RecoverPassowordComponent
          ),
        canActivate: [recoverpassGuard],
      },
      {
        path: 'novo-produto',
        title: 'Novo produto',
        loadComponent: () =>
          import('./pages/create-product/create-product.component').then(
            (a) => a.CreateProductComponent
          ),
        canActivate: [shopGuard],
      },
      {
        path: 'atualizar-produto/:id',
        title: 'Atualizar produto',
        loadComponent: () =>
          import('./pages/update-product/update-product.component').then(
            (a) => a.UpdateProductComponent
          ),
        canActivate: [shopGuard],
      },
      {
        path: 'produtos/categoria/:category',
        title: 'Produtos',
        loadComponent: () =>
          import('./pages/tela-produto/tela-produto.component').then(
            (p) => p.TelaProdutoComponent
          ),
      },
      {
        path: 'produtos/nome/:name',
        title: 'Produtos',
        loadComponent: () =>
          import('./pages/tela-produto/tela-produto.component').then(
            (p) => p.TelaProdutoComponent
          ),
      },
      {
        path: 'produtos/jogos/:gender',
        title: 'Produtos',
        loadComponent: () =>
          import('./pages/tela-produto/tela-produto.component').then(
            (p) => p.TelaProdutoComponent
          ),
      },
      {
        path: 'detalhe-produto/:id',
        title: 'Detalhe do Produto',
        loadComponent: () =>
          import('./pages/detalhe-produto/detalhe-produto.component').then(
            (m) => m.DetalheProdutoComponent
          ),
      },
      {
        path: 'carrinho',
        title: 'Carrinho de Compras',
        loadComponent: () =>
          import('./pages/shopping-cart/shopping-cart.component').then(
            (s) => s.ShoppingCartComponent
          ),
      },
      {
        path: 'carrinho/pagamento/cartao',
        title: 'Carrinho de Compras',
        loadComponent: () =>
          import('./pages/pagament/card/card.component').then(
            (s) => s.CardComponent
          ),
      },
      {
        path: 'graficos',
        title: 'Gráficos',
        loadComponent: () =>
          import('./pages/graficos-seller/graficos-seller.component').then(
            (s) => s.GraficosSellerComponent
          ),
        canActivate: [shopGuard],
      },
    ],
  },
];
