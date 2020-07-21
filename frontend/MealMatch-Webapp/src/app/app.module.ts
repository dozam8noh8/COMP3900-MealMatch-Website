import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {  MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule  } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule, MatSpinner } from '@angular/material/progress-spinner';
import { MatInputModule} from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatTabsModule} from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar'
import { NavbarComponent } from './navbar/navbar.component';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { IngredientSearchComponent } from './home-page/ingredient-search/ingredient-search.component';
import { IngredientByCategoryComponent } from './home-page/ingredient-by-category/ingredient-by-category.component';

import { RecipeInfoComponent } from './recipe-info/recipe-info.component';
import { SearchResultsComponent } from './search-results/search-results.component';

import { ProfilePageComponent } from './profile-page/profile-page.component';
import { LoginPopupComponent } from '../building-components/login-popup/login-popup.component';
import { MatDialogModule } from '@angular/material/dialog';
import { RequestLogInterceptor } from './request-interceptor';
import { CreateRecipeComponent } from './create-recipe/create-recipe.component';
import { NewIngredientPopupComponent } from './create-recipe/new-ingredient-popup/new-ingredient-popup.component';
import { RecipeViewCardComponent } from 'src/building-components/recipe-view-card/recipe-view-card.component';
import { DeleteRecipePopupComponent } from 'src/building-components/delete-recipe-popup/delete-recipe-popup.component';
import { PhotoUploadComponent } from './photo-upload/photo-upload.component';
import { IngredientSlotComponent } from './create-recipe/ingredient-slot/ingredient-slot.component';
import { AddRecipePopupComponent } from 'src/building-components/add-recipe-popup/add-recipe-popup.component';
import { LovelessSetsComponent } from './loveless-sets/loveless-sets.component';
import { IngredientSetDisplayComponent } from './ingredient-set-display/ingredient-set-display.component';
import { RecipeFormComponent } from './recipe-form/recipe-form.component';
import { FormSubmitComponent } from './form-submit/form-submit.component';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const materialModules = [
  MatToolbarModule,
  MatToolbarModule,
  MatMenuModule,
  MatIconModule,
  MatButtonModule,
  MatTableModule,
  MatDividerModule,
  MatProgressSpinnerModule,
  MatInputModule,
  MatCardModule,
  MatSlideToggleModule,
  MatSelectModule,
  MatOptionModule,
  MatCardModule,
  MatInputModule,
  MatAutocompleteModule,
  MatCheckboxModule,
  MatTabsModule,
  MatDialogModule,
]
@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    LoginComponent,
    SignupComponent,
    NavbarComponent,
    IngredientSearchComponent,
    IngredientByCategoryComponent,
    RecipeInfoComponent,
    SearchResultsComponent,
    CreateRecipeComponent,
    NewIngredientPopupComponent,
    ProfilePageComponent,
    LoginPopupComponent,
    RecipeViewCardComponent,
    DeleteRecipePopupComponent,
    PhotoUploadComponent,
    IngredientSlotComponent,
    AddRecipePopupComponent,
    LovelessSetsComponent,
    IngredientSetDisplayComponent,
    RecipeFormComponent,
    FormSubmitComponent,
    RecipeEditComponent,
    PageNotFoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    materialModules,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS, // This will intercept all http requests and add a delay and log them to simulate a backend delay (during development).
    useClass: RequestLogInterceptor,
    multi: true,
  },],
  bootstrap: [AppComponent]
})
export class AppModule { }
