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
              <h3>Reviews</h3>
              <ng-container *ngFor="let rc of allRatingComments">

                <div *ngIf="currentUser && rc.username === currentUser['username'] && editable; else elseNotEditable">
                  <!-- Allow the user to change rating and comment -->
                  <form [formGroup]="ratingCommentFormGroup" (ngSubmit)="postRatingComment()" class="rating-comment">
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

                </div>

                <!-- Just display the rating and comment -->
                <ng-template #elseNotEditable>
                  <div class="rating-comment">
                    <ngb-rating 
                    [(rate)]="rc.rating"
                    [max]="5"
                    [readonly]="true">
                      <ng-template let-fill="fill" let-index="index">
                        <span class="star" [class.filled]="fill === 100">&#9733;</span>
                      </ng-template>
                    </ngb-rating>

                    <!-- If a user is logged in and the ratingComment belongs to this user -->
                    <span *ngIf="currentUser && rc.username === currentUser['username']">
                      Your comment and rating <button mat-raised-button color="primary" (click)="toggleEdit()">Edit</button>
                    </span>

                    <span *ngIf="!currentUser || rc.username !== currentUser['username']">
                      from <em>{{rc.username}}</em>
                    </span>
                    
                    <div class="comment-div">
                      <strong>"{{rc.comment}}"</strong>
                    </div>
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
  ratingControl: FormControl;
  editable = false;

  constructor(
    private rcService: RatingCommentService,
    private authService: AuthService,
  ) { 

    this.ratingControl = new FormControl('');
    this.ratingCommentFormGroup = new FormGroup({
      rating: this.ratingControl, // validate?
      comment: new FormControl('') // validate?
    });

  }

  ngOnInit(): void {

    this.rcService.getAllRatingComments(this.recipeId)
    .subscribe( (rcResp: RatingComment[]) => {

      // We need to get the currently logged in user
      this.authService.getUserDetails()
      .subscribe( (userResp) => {

        this.currentUser = userResp;

        // Sort all ratingComments so that if there is one by the user, it is first
        this.allRatingComments = rcResp;
        this.allRatingComments = this.allRatingComments.sort( rc => {
          if(rc.username === this.currentUser['username']) {
            // If is a rating by the user already, set the form as well
            this.ratingCommentFormGroup.get('rating').setValue(rc.rating);
            this.ratingCommentFormGroup.get('comment').setValue(rc.comment);
            return -1;
          }
          return 0;
        })


      },
      (err) => {
        // If error with API call, it is likely that there is no user logged in
        // so just return all ratingComments
        this.allRatingComments = rcResp;
      })
    })


  }



  postRatingComment() {
    console.log(this.formRating)
    console.log(this.formComment)
  }

  toggleEdit() {
    this.editable = !this.editable;
  }

  get formRating() {
    return this.ratingCommentFormGroup.get('rating').value;
  }

  get formComment() {
    return this.ratingCommentFormGroup.get('comment').value;
  }

}
