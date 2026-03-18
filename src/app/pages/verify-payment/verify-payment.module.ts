import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {  IonDatetimeButton, IonicModule } from '@ionic/angular';

import { VerifyPaymentPageRoutingModule } from './verify-payment-routing.module';

import { VerifyPaymentPage } from './verify-payment.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerifyPaymentPageRoutingModule,
    ReactiveFormsModule,

  ],
  // declarations: [VerifyPaymentPage]
})
export class VerifyPaymentPageModule {}
