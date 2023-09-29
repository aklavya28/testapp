import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboadPage } from './dashboad.page';

const routes: Routes = [
  {
    path: '',
    component: DashboadPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboadPageRoutingModule {}
