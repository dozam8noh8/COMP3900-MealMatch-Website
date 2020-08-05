import { Component, OnInit } from '@angular/core';
import { Ingredient } from '../models/ingredient';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { RecipeService } from '../services/recipe.service';
import { ImageService } from '../image.service';
import { Recipe } from '../models/recipe';
import { Router } from '@angular/router';


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
/*
This component is used as a wrapper around the recipe-form component to create a recipe
from scratch. The class handles the API call once the recipe form emits all the details
of the recipe ready to create up to this class. */
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
    private router: Router,
    ) {    }

  ngOnInit(): void {

  }
  // Create the recipe in the backend and upload the photo once the recipe has been created.
  createRecipe(data: {recipe:Recipe, image?: File}){
    this.creatingRecipe = true;
    // Send to endpoint to create new recipe
    this.recipeService.createRecipe(data.recipe)
    .subscribe(
      (creation_response: any) => {
        this.creatingRecipe = false;
        this.API_message = creation_response.message;
        this.creationSuccessful = true;
        this.completedRecipeId = creation_response.recipe_id;

        // If an image was added with the recipe, send the image to the backend
        // once the recipe has been created in the backend.
        if(data.image) {
          // Use recipe id to upload image
          this.imageService.uploadRecipeImage(creation_response.recipe_id, data.image)
          .subscribe(
            (upload_response: any) => {
              this.creatingRecipe = false;
              this.API_message = creation_response.message;
              this.creationSuccessful = true;
              // If there was an image, we are ready to see the recipe.
              this.router.navigate([`/recipe/${creation_response.recipe_id}`])
            },
            err => {
              console.log("ERROR" , err);
            }
          )
        }
        // If there was no image, we are ready to navigate to see the recipe
        else {
          this.router.navigate([`/recipe/${creation_response.recipe_id}`])
        }

      },
      err => {
        console.log("ERROR" , err);
      }
    )
  }

}
