import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerifiedPaymentsPage } from './verified-payments.page';

const routes: Routes = [
  {
    path: '',
    component: VerifiedPaymentsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerifiedPaymentsPageRoutingModule {}
