import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OptPageRoutingModule } from './opt-routing.module';
import { NgOtpInputModule } from  'ng-otp-input';
import { OptPage } from './opt.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OptPageRoutingModule,
    NgOtpInputModule,

  ],
  declarations: [OptPage]
})
export class OptPageModule {}
