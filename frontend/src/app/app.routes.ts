import { Routes } from '@angular/router';
import { LayoutComponent } from './layouts/layout.component';

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
      },
      {
        path: 'perfil',
        title: 'perfil',
        loadComponent: () =>
          import('./pages/perfil/perfil.component').then(
            (a) => a.PerfilComponent
          ),
      },
      {
        path: 'trocar-senha',
        title: 'Troca de Senha',
        loadComponent: () =>
          import('./pages/recover-passoword/recover-passoword.component').then(
            (c) => c.RecoverPassowordComponent
          ),
      },
    ],
  },
];
