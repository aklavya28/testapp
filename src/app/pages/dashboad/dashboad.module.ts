import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashboadPageRoutingModule } from './dashboad-routing.module';

import { DashboadPage } from './dashboad.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DashboadPageRoutingModule
  ],
  declarations: [DashboadPage]
})
export class DashboadPageModule {}
