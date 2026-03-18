import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerifyPaymentPage } from './verify-payment.page';

const routes: Routes = [
  {
    path: '',
    component: VerifyPaymentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerifyPaymentPageRoutingModule {}
