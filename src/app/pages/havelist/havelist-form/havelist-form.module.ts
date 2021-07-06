import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HavelistFormPageRoutingModule } from './havelist-form-routing.module';

import { HavelistFormPage } from './havelist-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    HavelistFormPageRoutingModule
  ],
  declarations: [HavelistFormPage]
})
export class HavelistFormPageModule {}
