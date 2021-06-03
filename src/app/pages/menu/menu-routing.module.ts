import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuPage } from './menu.page';

const routes: Routes = [
  {
    path: '',
    component: MenuPage,
    children: [
      {path: 'home', loadChildren: '../home/home.module#HomePageModule' },
      {path: 'perfil', loadChildren: '../perfil/perfil.module#PerfilPageModule' },
      {path: 'search', loadChildren: '../search/search.module#SearchPageModule' },
      // {path: 'lists/havelist', loadChildren: '../lists/lists.module#ListsPageModule' },
      // {path: 'lists/wantlist', loadChildren: '../lists/lists.module#ListsPageModule' },
      {path: 'lists', loadChildren: '../lists/lists.module#ListsPageModule' },
      {path: 'trade', loadChildren: '../trade/trade.module#TradePageModule' },
      {path: 'chat', loadChildren: '../chat/chat.module#ChatPageModule' },
      {path: 'tutorial', loadChildren: '../tutorial/tutorial.module#TutorialPageModule' },
    ]
  },
  {
    path: '', redirectTo: '/menu/home'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuPageRoutingModule {}
