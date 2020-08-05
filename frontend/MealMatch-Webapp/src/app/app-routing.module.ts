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
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { RecipeFormGuardService } from './recipe-form-guard.service';
import { HallOfFameComponent } from './hall-of-fame/hall-of-fame.component';
import { AllRecipesComponent } from './all-recipes/all-recipes.component';


const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'home'}, // Redirect to /home for a nice clean entry route
  {path: 'home', component: HomePageComponent}, // this serves the home component
  {path: 'login', component: LoginComponent}, // Serves Login component at /login
  {path: 'signup', component: SignupComponent},
  {path: 'recipe/:id', component: RecipeInfoComponent},
  {path: 'search', component: SearchResultsComponent},
  {path: 'create', component: CreateRecipeComponent, canActivate: [AuthGuardService], canDeactivate: [RecipeFormGuardService]},
  {path: 'edit/:id', component: RecipeEditComponent, canActivate: [AuthGuardService, RecipeEditGuardService], canDeactivate: [RecipeFormGuardService]},
  {path: 'lovelesssets', component: LovelessSetsComponent}, // Component for sets with no recipes
  {path: 'dashboard', component: ProfilePageComponent, canActivate: [AuthGuardService]},
  {path: 'notfound', component: PageNotFoundComponent},
  {path: 'halloffame', component: HallOfFameComponent}, // Top contributors and recipes
  {path: 'allrecipes', component: AllRecipesComponent},
// This is the default "wildcard" if none of the above patterns match, we redirect to '' (home)
// We could also put a "pageNotFound" component here if we didnt want to confuse
// the users by redirecting here.
  {path: '**', redirectTo: '/notfound'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
