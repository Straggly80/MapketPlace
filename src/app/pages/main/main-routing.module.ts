import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainPage } from './main.page';

const routes: Routes = [
  {
    path: '',
    component: MainPage,
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('./home/home.module').then((m) => m.HomePageModule),
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('./profile/profile.module').then((m) => m.ProfilePageModule),
      },
       {
        path: 'ventas',
        loadChildren: () => 
          import('./ventas/ventas.module').then( m => m.VentasPageModule)
      },
      {
        path: 'mapa',
        loadChildren: () => 
          import('./mapa/mapa.module').then( m => m.MapaPageModule)
      },
       {
        path: 'menu',
        loadChildren: () => 
          import('./menu/menu.module').then( m => m.MenuPageModule)
      },
        {
        path: 'settings',
        loadChildren: () => import('./profile/settings/settings.module').then( m => m.SettingsPageModule)
      }

    ],
  },
 
 

 

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainPageRoutingModule {}
