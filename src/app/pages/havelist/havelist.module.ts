import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HaveListPageRoutingModule } from './havelist-routing.module';

import { HaveListPage } from './havelist.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HaveListPageRoutingModule
  ],
  declarations: [HaveListPage]
})
export class HaveListPageModule {}
