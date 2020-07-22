import { Component, OnInit } from '@angular/core';
import { Ingredient } from '../models/ingredient';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { RecipeService } from '../services/recipe.service';
import { ImageService } from '../image.service';
import { Recipe } from '../models/recipe';


@Component({
  selector: 'app-create-recipe',
  styleUrls: ['./create-recipe.component.scss'],
  template: `
    <app-recipe-form
    (buildRecipeEmitter)="createRecipe($event)"
    [completionSuccessMessage]="completionSuccessMessage"
    [submitting]="creatingRecipe"
    [completionErrorMessage]="completionErrorMessage"
    [submissionComplete]="creationSuccessful"
    [completedRecipeId]="completedRecipeId"
    ></app-recipe-form>

            `
})
export class CreateRecipeComponent implements OnInit {

  recipeImage: File;

  API_message: string;
  creatingRecipe: boolean = false;
  creationSuccessful: boolean = false;
  completionSuccessMessage = "Your recipe has been created!";
  completionErrorMessage = "";
  completedRecipeId: number;
  constructor(
    private recipeService: RecipeService,
    private imageService: ImageService,
    ) {    }

  ngOnInit(): void {

  }

  createRecipe(data: {recipe:Recipe, image?: File}){
    console.log(data);
    this.creatingRecipe = true;
    // Send to endpoint to create new recipe
    this.recipeService.createRecipe(data.recipe)
    .subscribe(
      (creation_response: any) => {
        console.log(creation_response.recipe_id);
        this.creatingRecipe = false;
        this.API_message = creation_response.message;
        this.creationSuccessful = true;
        this.completedRecipeId = creation_response.recipe_id;


        if(data.image) {
          // Use recipe id to upload image
          this.imageService.uploadRecipeImage(creation_response.recipe_id, data.image)
          .subscribe(
            (upload_response: any) => {
              this.creatingRecipe = false;
              this.API_message = creation_response.message;
              this.creationSuccessful = true;
            },
            err => {
              console.log("ERROR" , err);
            }
          )
        }

      },
      err => {
        console.log("ERROR" , err);
      }
    )
  }

}
