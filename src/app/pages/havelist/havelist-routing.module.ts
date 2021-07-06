import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HaveListPage } from './havelist.page';

const routes: Routes = [
  {
    path: '',
    component: HaveListPage
  },  {
    path: 'havelist-form',
    loadChildren: () => import('./havelist-form/havelist-form.module').then( m => m.HavelistFormPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HaveListPageRoutingModule {}
