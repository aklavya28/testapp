// import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TransactionsPageRoutingModule } from './transactions-routing.module';

import { TransactionsPage } from './transactions.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FontAwesomeModule,
    TransactionsPageRoutingModule
  ],
  declarations: [TransactionsPage]
})
export class TransactionsPageModule {}
