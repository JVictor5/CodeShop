import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { CommonModule } from '@angular/common';
import { HomeComponent } from './pages/home/home.component';
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
    ],
  },
];
