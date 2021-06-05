import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WantlistPageRoutingModule } from './wantlist-routing.module';

import { WantlistPage } from './wantlist.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WantlistPageRoutingModule
  ],
  declarations: [WantlistPage]
})
export class WantlistPageModule {}
