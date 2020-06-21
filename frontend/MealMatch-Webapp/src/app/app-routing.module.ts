import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { PrivateResourceComponent } from './private-resource/private-resource.component';
import { AuthGuardService } from './auth-guard.service';


const routes: Routes = [
  //{path: '', pathMatch: 'full', redirectTo: 'home'}, // This redirects to the home route (the next one)
  {path: 'home', component: HomePageComponent}, // this serves the home component
  {path: 'login', component: LoginComponent}, // Serves Login component at /login
  {path: 'signup', component: SignupComponent},
  {path: 'privateResource', component: PrivateResourceComponent, canActivate: [AuthGuardService]}, // This is just to demonstrate a resource only logged in users can access.
// This is the default "wildcard" if none of the above patterns match, we redirect to '' (home)
// We could also put a "pageNotFound" component here if we didnt want to confuse
// the users by redirecting here.
  {path: '**', redirectTo: 'home'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
