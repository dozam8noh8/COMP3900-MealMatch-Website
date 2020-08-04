import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RatingCommentService } from 'src/app/services/rating-comment.service';
import { RatingComment } from 'src/app/models/rating_comment';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-review-section',
  styleUrls: ['./review-section.component.scss'],
  template: `
              <h2>Reviews</h2>
              <mat-spinner *ngIf="loadingComments"> </mat-spinner> 

              <!-- If the currently logged in user has not posted a ratingComment yet AND this recipe does not belong to said user --> 
              <ng-container *ngIf="!loadingComments && currentUser && !existingRC && recipeOwnerId !== currentUser.user_id">
                <mat-spinner *ngIf="postingUserRC"> </mat-spinner> 
                <form 
                *ngIf="!postingUserRC"
                [formGroup]="ratingCommentFormGroup" 
                (ngSubmit)="postRatingComment()">
                  <ngb-rating 
                  [formControl]="ratingCommentFormGroup.get('rating')"
                  [max]="5"
                  [readonly]="false">
                    <ng-template let-fill="fill" let-index="index">
                      <span class="star" [class.filled]="fill === 100">&#9733;</span>
                    </ng-template>
                  </ngb-rating>

                  <div>
                    Comment: <br/>
                    <textarea formControlName="comment" #matInput rows="5" style="width:90%"></textarea>
                    <br/>
                    <button type="submit" mat-raised-button color="primary">Add a review</button>            
                    <div *ngIf="submitAttempted && ratingCommentFormGroup.invalid" style="color:red;">
                      A review must have a comment and rating from 1 to 5.
                    </div>
                  </div>
                </form>
              </ng-container>

              <!-- If there are no comments at all --> 
              <ng-container *ngIf="allRatingComments && allRatingComments.length <= 0">
                There are no reviews for this recipe.
              </ng-container>

              <br/>
              <br/>
              <!-- If not a logged in user -->
              <ng-container *ngIf="!loadingComments && !currentUser">
                You must be logged in to review recipes. <br/>
                <a routerLink="/login">Log in</a> | 
                Don't have an account? <a routerLink="/signup">Sign up</a>
              </ng-container>

              <ng-container *ngFor="let rc of allRatingComments">

                <!-- If the current ratingComment belongs to the logged in user -->
                <div class="rating-comment" *ngIf="currentUser && rc.username === currentUser['username']; else elseNotCurrentUsers">
                  <mat-spinner *ngIf="postingUserRC"> </mat-spinner> 

                  <!-- Allow the user to change rating and comment -->
                  <form 
                  *ngIf="!postingUserRC && editable"
                  [formGroup]="ratingCommentFormGroup" 
                  (ngSubmit)="postRatingComment()">
                    <ngb-rating 
                    [formControl]="ratingCommentFormGroup.get('rating')"
                    [max]="5"
                    [readonly]="false">
                      <ng-template let-fill="fill" let-index="index">
                        <span class="star" [class.filled]="fill === 100">&#9733;</span>
                      </ng-template>
                    </ngb-rating>

                    <div>
                      Comment: <br/>
                      <textarea formControlName="comment" rows="5" style="width:90%"></textarea>                      <br/>
                      <button (click)="toggleEdit()" mat-raised-button color="basic">Cancel</button>
                      <button type="submit" mat-raised-button color="primary">Save</button>            
                      <div *ngIf="submitAttempted && ratingCommentFormGroup.invalid" style="color:red;">
                        A review must have a comment and rating from 1 to 5.
                      </div>
                    </div>
                  </form>

                  <!-- Just display the rating and comment with an edit button -->
                  <div *ngIf="!postingUserRC && !editable">
                    <app-display-review
                    [review]="rc"
                    [currentUser]="currentUser"
                    (toggleEditEmitter)="toggleEdit()"
                    (deleteEmitter)="getAllRatingComments()"></app-display-review>
                  </div>

                </div>

                <!-- Just display the rating and comment -->
                <ng-template #elseNotCurrentUsers>
                  <div class="rating-comment">
                    <app-display-review
                    [review]="rc"></app-display-review>                  
                  </div>

                </ng-template>


              </ng-container>
            `
})
export class ReviewSectionComponent implements OnInit {

  @Input() recipeId: number;
  @Input() recipeOwnerId: number;
  @Output() reloadEmitter = new EventEmitter();
  allRatingComments: RatingComment[];
  currentUser: User;

  ratingCommentFormGroup: FormGroup;

  // Keeps track of whether a form or just a review should be displayed
  editable = false;
  // A user's existing review, if they have one
  existingRC: RatingComment;

  // Keeps track of whether rating/comments are being retrieved
  loadingComments: boolean;
  // Keeps track of whether a review is being posted
  postingUserRC: boolean;

  // Keeps track of whether an attempt to submit the form has been made
  submitAttempted: boolean;

  constructor(
    private rcService: RatingCommentService,
    private authService: AuthService,
  ) { 

    this.ratingCommentFormGroup = new FormGroup({
      rating: new FormControl('', Validators.required),
      comment: new FormControl('', Validators.required)
    });

  }

  ngOnInit(): void {
    this.loadingComments = true;
    this.getAllRatingComments();
  }

  postRatingComment() {
    // Note that user has tried to submit a review
    this.submitAttempted = true;
    // Check if all form fields are valid
    if(this.ratingCommentFormGroup.invalid) {
      return;
    }

    // Note that the rating/comment is not being posted
    this.postingUserRC = true;
    let rating = this.formRating.value;
    let comment = this.formComment.value;
    this.rcService.postRatingComment(this.recipeId, rating, comment)
    .subscribe( (resp) => {
      this.editable = false;
      // Once rating/comment has been posted, refresh the comments again
      this.getAllRatingComments();
    },
    err => {
      console.log("ERROR")
    })
  }

  getAllRatingComments() {
    this.formRating.setValue('');
    this.formComment.setValue('');
    this.submitAttempted = false;

    this.rcService.getAllRatingComments(this.recipeId)
    .subscribe( (rcResp: RatingComment[]) => {
      this.reloadEmitter.emit(this.recipeId)
      // We need to get the currently logged in user
      this.authService.getUserDetails()
      .subscribe( (userResp) => {

        this.currentUser = userResp;   

        this.allRatingComments = rcResp;
        this.existingRC = this.allRatingComments.find( rc => rc.username === this.currentUser['username'] );

        // If there is already a ratingComment by the user
        if(this.existingRC) {
          // Remove it at its index
          const index = this.allRatingComments.findIndex( elem => elem===this.existingRC);
          this.allRatingComments.splice(index, 1);

          // Place it at the front
          this.allRatingComments.unshift(this.existingRC);
          
          // Set the form
          this.formRating.setValue(this.existingRC.rating);
          this.formComment.setValue(this.existingRC.comment);
        }

        this.loadingComments = false;
        this.postingUserRC = false;
      },
      (err) => {
        // If error with API call, it is likely that there is no user logged in
        // so just return all ratingComments
        this.allRatingComments = rcResp;
        this.loadingComments = false;
      })
    })

  }

  toggleEdit() {
    this.editable = !this.editable;
  }

  get formRating() { return this.ratingCommentFormGroup.get('rating') }
  get formComment() { return this.ratingCommentFormGroup.get('comment') }

}
