import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HavelistFormPage } from './havelist-form.page';

const routes: Routes = [
  {
    path: '',
    component: HavelistFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HavelistFormPageRoutingModule {}
