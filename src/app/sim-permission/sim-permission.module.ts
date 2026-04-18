import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SimPermissionPageRoutingModule } from './sim-permission-routing.module';

import { SimPermissionPage } from './sim-permission.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SimPermissionPageRoutingModule
  ],
  declarations: [SimPermissionPage]
})
export class SimPermissionPageModule {}
