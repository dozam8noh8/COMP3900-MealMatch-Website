import { Component, OnInit } from '@angular/core';
import { Ingredient } from '../models/ingredient';
import { RecipeService } from '../services/recipe.service';
import { ImageService } from '../image.service';
import { Recipe } from '../models/recipe';
import { ActivatedRoute, Router } from '@angular/router';


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
    [completedRecipeId]="completedRecipeId"
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
  completedRecipeId: number;
  constructor(
    private recipeService: RecipeService,
    private imageService: ImageService,
    private route: ActivatedRoute,
    private router: Router,
    ) {    }

  ngOnInit(): void {
    this.setTargetRecipe();
  }

  setTargetRecipe(){
    // Get recipe id from route and then populate the details from the service
    let recipeId = +this.route.snapshot.paramMap.get('id'); // plus sign converts to int!
    return this.recipeService.getRecipeDetails(recipeId).subscribe( // TODO add error handling
      (data: any) => {
        this.recipeToEdit = data;
      }
    );
  }
  editRecipe(data: {recipe:Recipe, image?: File}){
    this.submitting = true;
    // Send to endpoint to create new recipe
    this.recipeService.editRecipe({
      ...data.recipe,
      id: this.recipeToEdit.id}) // Add recipe id from the route onto the recipe we're editing.
    .subscribe(
      (creation_response: any) => {
        this.submitting = false;
        this.API_message = creation_response.message;
        this.submissionSuccessful = true;
        this.completedRecipeId = creation_response.recipe_id;
        console.log("completedRecipeId = ", this.completedRecipeId)
        if(data.image) {
          // Use recipe id to upload image
          this.imageService.uploadRecipeImage(this.recipeToEdit.id, data.image)
          .subscribe(
            (upload_response: any) => {
              this.submitting = false;
              this.API_message = upload_response.message;
              this.submissionSuccessful = true;
              this.router.navigate([`/recipe/${this.recipeToEdit.id}`])
            },
            err => {
              console.log("ERROR", err);
            }
          )
        }
        else {
          this.router.navigate([`/recipe/${this.recipeToEdit.id}`])

        }

      },
      err => {
        console.log("ERROR" , err);
      }
    )
  }


}
