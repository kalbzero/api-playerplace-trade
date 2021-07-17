import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TradePage } from './trade.page';

const routes: Routes = [
  {
    path: '',
    component: TradePage
  },
  {
    path: 'trade-form/:id',
    loadChildren: () => import('./trade-form/trade-form.module').then( m => m.TradeFormPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TradePageRoutingModule {}
