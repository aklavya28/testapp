import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RxjsPageRoutingModule } from './rxjs-routing.module';

import { RxjsPage } from './rxjs.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RxjsPageRoutingModule
  ],
  declarations: [RxjsPage]
})
export class RxjsPageModule {}
