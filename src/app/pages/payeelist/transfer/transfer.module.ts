import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { TransferPageRoutingModule } from './transfer-routing.module';

import { TransferPage } from './transfer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TransferPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [TransferPage]
})
export class TransferPageModule {}
