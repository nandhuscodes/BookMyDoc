import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { PatLoginComponent } from './pat-login/pat-login.component';
import { PatSignupComponent } from './pat-signup/pat-signup.component';
import { DocLoginComponent } from './doc-login/doc-login.component';
import { DocSignupComponent } from './doc-signup/doc-signup.component';
import { AdminComponent } from './admin/admin.component';
import { PnfComponent } from './pnf/pnf.component';
import { BotComponent } from './bot/bot.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  {path:"",component:LandingComponent},
  {path:"patient-login",component:PatLoginComponent},
  {path:"patient-signup",component:PatSignupComponent},
  {path:"doctor-login",component:DocLoginComponent},
  {path:"doctor-signup",component:DocSignupComponent},
  {path:"admin",component:AdminComponent},
  {path:"chatbot",component:BotComponent},
  {path:"dashboard",component:DashboardComponent},
  {path:"**",component:PnfComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
