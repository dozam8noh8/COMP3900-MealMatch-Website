import { Component, OnInit, Input } from '@angular/core';
import { RatingCommentService } from 'src/app/services/rating-comment.service';
import { RatingComment } from 'src/app/models/rating_comment';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-display-comments',
  styleUrls: ['./display-comments.component.scss'],
  template: `
              <h2>Reviews</h2>
              <mat-spinner *ngIf="loadingComments"> </mat-spinner> 

              <!-- If the currently logged in user has not posted a ratingComment yet --> 
              <ng-container *ngIf="!loadingComments && currentUser && !existingRC">
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
                    <textarea formControlName="comment"></textarea>
                    <br/>
                    <button type="submit" mat-raised-button color="primary">Add a review</button>            
                  </div>
                </form>
              </ng-container>

              <!-- If there are no comments at all --> 
              <ng-container *ngIf="allRatingComments && allRatingComments.length <= 0">
                There are no reviews for this recipe.
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
                      <textarea formControlName="comment"></textarea>
                      <br/>
                      <button (click)="toggleEdit()" mat-raised-button color="warn">Cancel</button>
                      <button type="submit" mat-raised-button color="primary">Save</button>            
                    </div>
                  </form>

                  <!-- Just display the rating and comment with an edit button -->
                  <div *ngIf="!postingUserRC && !editable">
                    <app-display-review
                    [rating]="rc.rating"
                    [username]="rc.username"
                    [comment]="rc.comment"
                    [currentUser]="currentUser['username']"
                    (toggleEditEmitter)="toggleEdit()"></app-display-review>
                  </div>

                </div>

                <!-- Just display the rating and comment -->
                <ng-template #elseNotCurrentUsers>
                  <div class="rating-comment">
                    <app-display-review
                    [rating]="rc.rating"
                    [username]="rc.username"
                    [comment]="rc.comment"></app-display-review>                  
                  </div>

                </ng-template>


              </ng-container>

            `
})
export class DisplayCommentsComponent implements OnInit {

  @Input() recipeId: number;
  allRatingComments: RatingComment[];
  currentUser: User;

  ratingCommentFormGroup: FormGroup;
  editable = false;
  existingRC: RatingComment;

  loadingComments: boolean;
  postingUserRC: boolean;

  constructor(
    private rcService: RatingCommentService,
    private authService: AuthService,
  ) { 

    this.ratingCommentFormGroup = new FormGroup({
      rating: new FormControl(''), // validate?
      comment: new FormControl('') // validate?
    });

  }

  ngOnInit(): void {
    this.loadingComments = true;
    this.getAllRatingComments();
  }

  postRatingComment() {
    this.postingUserRC = true;
    let rating = this.ratingCommentFormGroup.get('rating').value;
    let comment = this.ratingCommentFormGroup.get('comment').value;
    this.rcService.postRatingComment(this.recipeId, rating, comment)
    .subscribe( (resp) => {
      console.log(resp);
      this.editable = false;
      this.getAllRatingComments();
    },
    err => {
      console.log("ERROR")
    })
  }

  getAllRatingComments() {
    this.rcService.getAllRatingComments(this.recipeId)
    .subscribe( (rcResp: RatingComment[]) => {

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
          this.ratingCommentFormGroup.get('rating').setValue(this.existingRC.rating);
          this.ratingCommentFormGroup.get('comment').setValue(this.existingRC.comment);
        }

        this.postingUserRC = false;
        this.loadingComments = false;
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

}
