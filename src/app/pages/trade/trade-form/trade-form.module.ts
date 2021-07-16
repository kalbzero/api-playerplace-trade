import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TradeFormPageRoutingModule } from './trade-form-routing.module';

import { TradeFormPage } from './trade-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    TradeFormPageRoutingModule
  ],
  declarations: [TradeFormPage]
})
export class TradeFormPageModule {}
