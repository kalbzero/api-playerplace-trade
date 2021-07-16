import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TradeFormPage } from './trade-form.page';

const routes: Routes = [
  {
    path: '',
    component: TradeFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TradeFormPageRoutingModule {}
