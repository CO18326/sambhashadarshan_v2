import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SigninComponent } from './features/auth/signin/signin.component';
import { SignupComponent } from './features/auth/signup/signup.component';
import { redirectLoggedInTo, canActivate, redirectUnauthorizedTo, AuthGuard } from '@angular/fire/auth-guard';
import {AuthGuardGuard} from './features/auth-guard.guard'
import { MainComponent } from './features/main/main.component';
import { VideoCallComponent } from './features/main/video-call/video-call.component';

const routes: Routes = [
  { path: '', redirectTo: 'chat', pathMatch: 'full' },
  { path: 'signin', component: SigninComponent, canActivate:[AuthGuardGuard]},
  { path: 'signup', component: SignupComponent, canActivate:[AuthGuardGuard]},
  { path: 'chat',component: MainComponent  ,canActivate:[AuthGuardGuard]},
  {path: "videoCall", component:VideoCallComponent}
  ,
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
