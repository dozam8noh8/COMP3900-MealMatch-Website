import { Injectable } from '@angular/core';

import {Ingredient} from '../models/ingredient';
import { Category } from '../home-page/category';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { IngredientSearchComponent } from '../home-page/ingredient-search/ingredient-search.component';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class IngredientService {

  private ingredientsListStorage: string = "StoredIngredients";
  BASE_URL = 'http://localhost:5000/api'
  // All the ingredients from the system.
  allIngredients: Ingredient[] = [];
  // All categories, containing the category name and all the ingredients within that category.
  allCategories: Category[];
  // Ingredients that are ticked in the category selection and displayed in the "My ingredient list"
  addedIngredients: Ingredient[] = [];
  // Ingredients that are retrieved from local storage in constructor and should be added to the list when retrieved.
  localStorageIngredients: Ingredient[] = [];

  constructor(private http: HttpClient, private authService: AuthService) {
    this.restart();
  }
  // We want to reinitialise the service on login.
  // This will be called from AuthService, try to remove this coupling.
  restart(){
        // If there is ingredientList from previous session, restore it
        let storedData = localStorage.getItem(this.ingredientsListStorage);
        if(storedData) {
          let localStorageItem = JSON.parse(storedData);
          // If the user is the same as the previous user, or they are both undefined.
          if (localStorageItem?.userId === this.authService.getLoggedInUserId()) {
            this.localStorageIngredients = localStorageItem.ingredients;
          }
        }
        this.getFromDB();
  }

  getFromDB(callback=null) {
    this.http.get("http://localhost:5000/api/get_ingredients_in_categories")
    .subscribe( (data: Category[]) => {
      this.allCategories = data;
      this.allCategories.forEach( category => {
        category.ingredients = category.ingredients.map( item => {
          item = { ...item,
                            // Make sure ingredients (if on localStorage ingredient list) is checked off
                    onList: this.localStorageIngredients.some(elem => (elem.id===item.id)) ? true : false
                  };
          if (item.onList){
            this.addedIngredients.push(item);
          }
          this.allIngredients.push(item);
          return item;
        });
      });

      if(callback) callback(this.allIngredients);

    });
  }

  // TODO add error handling
  // TODO, add to all categories once we know what it does.
  createNewIngredient(ingredientName: string, ingredientCategory: string) {
    return this.http.post("http://localhost:5000/api/add_ingredient", { name: ingredientName, category: ingredientCategory}).pipe(map((response: any) => {
      // Add the returned ingredient to the local service ingredients.
      let ingredient: Ingredient = {
          name: ingredientName,
          category: ingredientCategory,
          id: response.id,
          onList: false,
      }
      this.allIngredients.push(ingredient);
      // Add to all categories.
      for (const category of this.allCategories) {
        if (category.name === ingredientCategory){
          category.ingredients.push(ingredient)
        }
      } //push(ingredient);

      return response;
    }));
  }

  ngOnInit() { }

  getAllIngredients(flush=false) {
    if (flush){
      this.getFromDB()
    }
    return this.allIngredients;
  }

  getAddedIngredients(): Ingredient[] {
    return this.addedIngredients;
  }

  addOrRemove(ingredient: Ingredient) {
    ingredient.onList ? this.removeFromList(ingredient) : this.addToList(ingredient);
  }

  addToList(newIngredient: Ingredient) {
    newIngredient.onList = true;
    this.addedIngredients.push(newIngredient);
    this.saveIngredients();
  }

  removeFromList(ingredient: Ingredient) {
    ingredient.onList = false;
    this.addedIngredients = this.addedIngredients.filter(item => item!=ingredient);
    this.saveIngredients();
  }

  getAllCategories(): Category[] {
    return this.allCategories;
  }

  removeAllFromList() {
    this.addedIngredients.map(ingredient => this.removeFromList(ingredient));
  }

  // TODO We should have these preferences saved per user. (Maybe in session storage?)
  saveIngredients() {
    let userId = this.authService.getLoggedInUserId();
    let storageItem = {
      ingredients: this.addedIngredients,
      userId: userId
    }
    localStorage.setItem(this.ingredientsListStorage, JSON.stringify(storageItem));
  }

  getLovelessSets() {
    return this.http.get(`${this.BASE_URL}/popular_ingredient_pairs`);
  }

}
