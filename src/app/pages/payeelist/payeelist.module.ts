import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PayeelistPageRoutingModule } from './payeelist-routing.module';

import { PayeelistPage } from './payeelist.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PayeelistPageRoutingModule,

  ],
  declarations: [PayeelistPage]
})
export class PayeelistPageModule {}
