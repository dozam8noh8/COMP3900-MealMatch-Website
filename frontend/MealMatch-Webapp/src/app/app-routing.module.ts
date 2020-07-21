import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { RecipeInfoComponent } from './recipe-info/recipe-info.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { AuthGuardService } from './auth/auth-guard.service';
import { CreateRecipeComponent } from './create-recipe/create-recipe.component';
import { LovelessSetsComponent } from './loveless-sets/loveless-sets.component';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { RecipeEditGuardService } from './recipe-edit/recipe-edit-guard.service';


const routes: Routes = [
  //{path: '', pathMatch: 'full', redirectTo: 'home'}, // This redirects to the home route (the next one)
  {path: 'home', component: HomePageComponent}, // this serves the home component
  {path: 'login', component: LoginComponent}, // Serves Login component at /login
  {path: 'signup', component: SignupComponent},
  {path: 'recipe/:id', component: RecipeInfoComponent},
  {path: 'search', component: SearchResultsComponent},
  {path: 'create', component: CreateRecipeComponent, canActivate: [AuthGuardService]},
  {path: 'edit/:id', component: RecipeEditComponent, canActivate: [AuthGuardService, RecipeEditGuardService]},
  {path: 'lovelesssets', component: LovelessSetsComponent}, // Component for sets with no recipes
  {path: 'dashboard', component: ProfilePageComponent, canActivate: [AuthGuardService]}, // This is just to demonstrate a resource only logged in users can access.
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
