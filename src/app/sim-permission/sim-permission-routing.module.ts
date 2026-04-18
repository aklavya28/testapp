import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SimPermissionPage } from './sim-permission.page';

const routes: Routes = [
  {
    path: '',
    component: SimPermissionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SimPermissionPageRoutingModule {}
