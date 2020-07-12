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
import { ReactiveFormsModule } from '@angular/forms';

import { IngredientSearchComponent } from './home-page/ingredient-search/ingredient-search.component';
import { IngredientByCategoryComponent } from './home-page/ingredient-by-category/ingredient-by-category.component';

import { RecipeInfoComponent } from './recipe-info/recipe-info.component';
import { SearchResultsComponent } from './search-results/search-results.component';

import { ProfilePageComponent } from './profile-page/profile-page.component';
import { PopupComponent } from '../building-components/login-popup/popup.component';
import { MatDialogModule } from '@angular/material/dialog';
import { RequestLogInterceptor } from './request-interceptor';
import { RecipeViewCardComponent } from 'src/building-components/recipe-view-card/recipe-view-card.component';

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
    ProfilePageComponent,
    PopupComponent,
    RecipeViewCardComponent,
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
