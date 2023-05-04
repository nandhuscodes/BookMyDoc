import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingComponent } from './landing/landing.component';
import { PatLoginComponent } from './pat-login/pat-login.component';
import { PatSignupComponent } from './pat-signup/pat-signup.component';
import { DocSignupComponent } from './doc-signup/doc-signup.component';
import { DocLoginComponent } from './doc-login/doc-login.component';
import { FormsModule } from '@angular/forms';
import { AdminComponent } from './admin/admin.component';
import { PnfComponent } from './pnf/pnf.component';
import { HttpClientModule } from '@angular/common/http';
import { BotComponent } from './bot/bot.component';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    PatLoginComponent,
    PatSignupComponent,
    DocSignupComponent,
    DocLoginComponent,
    AdminComponent,
    PnfComponent,
    BotComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
