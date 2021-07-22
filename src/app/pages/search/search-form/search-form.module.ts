import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchFormPageRoutingModule } from './search-form-routing.module';

import { SearchFormPage } from './search-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    SearchFormPageRoutingModule
  ],
  declarations: [SearchFormPage]
})
export class SearchFormPageModule {}
