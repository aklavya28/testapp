import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PayeelistPage } from './payeelist.page';

const routes: Routes = [
  {
    path: '',
    component: PayeelistPage
  },
  {
    path: 'transfer/:slug',
    loadChildren: () => import('./transfer/transfer.module').then( m => m.TransferPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PayeelistPageRoutingModule {}
