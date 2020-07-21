import { Component, OnInit } from '@angular/core';
import { Ingredient } from '../models/ingredient';
import { RecipeService } from '../services/recipe.service';
import { ImageService } from '../image.service';
import { Recipe } from '../models/recipe';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-recipe-edit',
  template: `
    <app-recipe-form *ngIf="recipeToEdit"
    (buildRecipeEmitter)="editRecipe($event)"
    [recipeDetails]="recipeToEdit"
    [completionSuccessMessage]="completionSuccessMessage"
    [submitting]="submitting"
    [completionErrorMessage]="completionErrorMessage"
    [submissionComplete]="submissionSuccessful"
    ></app-recipe-form>

            `
})
export class RecipeEditComponent implements OnInit {

  recipeImage: File;
  recipeToEdit: Recipe;
  API_message: string;
  submitting: boolean = false;
  submissionSuccessful: boolean = false;
  completionSuccessMessage = "Recipe successfully edited!";
  completionErrorMessage = "";
  constructor(
    private recipeService: RecipeService,
    private imageService: ImageService,
    private route: ActivatedRoute,
    ) {    }

  ngOnInit(): void {
    this.setTargetRecipe();
  }

  setTargetRecipe(){
    // Get recipe id from route and then populate the details from the service
    let recipeId = +this.route.snapshot.paramMap.get('id'); // plus sign converts to int!
    return this.recipeService.getRecipeDetails(recipeId).subscribe( // TODO add error handling
      (data: any) => {
        console.log("Getting this data", data);
        this.recipeToEdit = data;
      }
    );
  }
  editRecipe(data: {recipe:Recipe, image?: File}){
    console.log(data);
    this.submitting = true;
    // Send to endpoint to create new recipe
    this.recipeService.createRecipe(data.recipe) // TODO CHANGE THIS TO EDIT
    .subscribe(
      (creation_response: any) => {
        console.log(creation_response.recipe_id);
        this.submitting = false;
        this.API_message = creation_response.message;
        this.submissionSuccessful = true;

        if(data.image) {
          // Use recipe id to upload image
          this.imageService.uploadRecipeImage(creation_response.recipe_id, data.image)
          .subscribe(
            (upload_response: any) => {
              this.submitting = false;
              this.API_message = creation_response.message;
              this.submissionSuccessful = true;
            },
            err => {
              console.log(err);
            }
          )
        }

      },
      err => {
        console.log(err);
      }
    )
  }

}
