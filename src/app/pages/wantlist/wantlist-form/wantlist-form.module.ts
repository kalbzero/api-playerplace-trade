import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WantlistFormPageRoutingModule } from './wantlist-form-routing.module';

import { WantlistFormPage } from './wantlist-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    WantlistFormPageRoutingModule
  ],
  declarations: [WantlistFormPage]
})
export class WantlistFormPageModule {}
