import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy, Platform } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { AuthGuard } from './guards/auth.guard';

// font - awsome
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,
    HttpClientModule,
    FontAwesomeModule



  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Platform,
    AuthGuard
  ],
  bootstrap: [AppComponent],
})
export class AppModule {

  constructor(library: FaIconLibrary) {
		library.addIconPacks(fas, fab, far);
	}

}
