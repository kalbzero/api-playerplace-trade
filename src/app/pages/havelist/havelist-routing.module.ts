import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HaveListPage } from './havelist.page';

const routes: Routes = [
  {
    path: '',
    component: HaveListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HaveListPageRoutingModule {}
