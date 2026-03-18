import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerifiedPaymentsPageRoutingModule } from './verified-payments-routing.module';

import { VerifiedPaymentsPage } from './verified-payments.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerifiedPaymentsPageRoutingModule
  ],
  declarations: [VerifiedPaymentsPage]
})
export class VerifiedPaymentsPageModule {}
