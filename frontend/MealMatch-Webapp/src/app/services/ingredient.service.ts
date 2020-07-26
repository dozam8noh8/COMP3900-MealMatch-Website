import { Injectable } from '@angular/core';

import {Ingredient} from '../models/ingredient';
import { Category } from '../models/category';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
/* The ingredient service provides and keeps track of the data relating to ingredients.
it makes the api calls to the backend to populate lists of Ingredients or categories
and then components request lists. Data can become stale if the backend updates so
if fresh data is needed, call the restart method to get data from the DB again. */
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

  recommendedIngredients: Ingredient[] = [];

  constructor(private http: HttpClient, private authService: AuthService) {
    this.restart();
  }
  // We want to reinitialise the service on login.
  // This will be called from AuthService, try to remove this coupling.
  restart(){
        console.log("Initialising ingredients")
        // If there is ingredientList from previous session, restore it
        let storedData = localStorage.getItem(this.ingredientsListStorage);
        if(storedData) {
          console.log("Added ingredients", this.addedIngredients)
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
      // Reinitialise all ingredient lists.
      this.addedIngredients = [];
      this.allIngredients = [];
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
      this._reloadRecommendedIngredients();

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
      }

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

  addToList(newIngredient: Ingredient) {
    newIngredient.onList = true;
    this.addedIngredients.push(newIngredient);
    this.saveIngredients();
    this._reloadRecommendedIngredients();
  }

  removeFromList(ingredient: Ingredient) {
    ingredient.onList = false;
    this.addedIngredients = this.addedIngredients.filter(item => item!=ingredient);
    this.saveIngredients();
    this._reloadRecommendedIngredients();
  }

  getAllCategories(): Category[] {
    return this.allCategories;
  }

  removeAllFromList() {
    this.addedIngredients.forEach(ingredient => ingredient.onList = false);
    this.addedIngredients = [];
    this.saveIngredients();
    this._reloadRecommendedIngredients();
  }

  // TODO We should have these preferences saved per user. (Maybe in session storage?)
  saveIngredients() {
    let userId = this.authService.getLoggedInUserId();
    let storageItem = {
      ingredients: this.addedIngredients,
      userId: userId
    }
    console.log(storageItem);
    localStorage.setItem(this.ingredientsListStorage, JSON.stringify(storageItem));
  }

  getLovelessSets() {
    return this.http.get(`${this.BASE_URL}/popular_ingredient_pairs`);
  }


  getRecommendedIngredients(): Ingredient[] {
    return this.recommendedIngredients;
  }

  private _reloadRecommendedIngredients() {
    const ingredientsIdList = this.addedIngredients.map(elem => elem.id);
    return this.http.post<Ingredient[]>("http://localhost:5000/api/recommendations", {"ingredients": ingredientsIdList})
    .subscribe(resp => {
      this.recommendedIngredients = resp;
    })
    // error handling
  }

}
