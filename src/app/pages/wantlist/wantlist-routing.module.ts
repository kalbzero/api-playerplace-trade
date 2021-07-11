import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WantlistPage } from './wantlist.page';

const routes: Routes = [
  {
    path: '',
    component: WantlistPage
  },  {
    path: 'wantlist-form',
    loadChildren: () => import('./wantlist-form/wantlist-form.module').then( m => m.WantlistFormPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WantlistPageRoutingModule {}
