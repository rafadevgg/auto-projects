import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'gerador',
    loadComponent: () => import('./pages/gerador/gerador.component').then(m => m.GeradorComponent)
  },
  {
    path: 'plantas',
    loadComponent: () => import('./pages/plantas/plantas.component').then(m => m.PlantasComponent)
  },
  {
    path: 'planta/:id',
    loadComponent: () => import('./pages/planta-detalhe/planta-detalhe.component').then(m => m.PlantaDetalheComponent)
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];