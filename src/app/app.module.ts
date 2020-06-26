import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
// My Imports ~~~~~~~~~~~~~
import {ModalModule} from './shared/modules/modal/modal.module';
import {LandingModule} from './views/landing/landing.module';
import {DashboardModule} from './views/dashboard/dashboard.module';
// My Imports End ~~~~~~~~~

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ModalModule,
    LandingModule,
    DashboardModule,
  ],
  exports: [ ],
  providers: [ ],
  bootstrap: [AppComponent],
  entryComponents: []
})
export class AppModule { }
