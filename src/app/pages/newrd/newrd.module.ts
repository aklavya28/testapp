import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewrdPageRoutingModule } from './newrd-routing.module';

import { NewrdPage } from './newrd.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewrdPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [NewrdPage]
})
export class NewrdPageModule {}
