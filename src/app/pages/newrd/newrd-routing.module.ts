import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewrdPage } from './newrd.page';

const routes: Routes = [
  {
    path: '',
    component: NewrdPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewrdPageRoutingModule {}
