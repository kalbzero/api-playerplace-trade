import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WantlistFormPage } from './wantlist-form.page';

const routes: Routes = [
  {
    path: '',
    component: WantlistFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WantlistFormPageRoutingModule {}
