import { Component, OnInit, Input } from '@angular/core';
import { RatingCommentService } from 'src/app/services/rating-comment.service';
import { RatingComment } from 'src/app/models/rating_comment';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-display-comments',
  styleUrls: ['./display-comments.component.scss'],
  template: `
              <h3>Reviews</h3>
              <ng-container *ngFor="let rc of allRatingComments">

                <div *ngIf="currentUser && rc.username === currentUser['username']; else elseNotUser">
                  HAVE EDIT BUTTON
                  <div class="rating-comment">
                    <app-star-system
                    [rating]="rc.rating"></app-star-system>
                    from <em>{{rc.username}}</em>
                    <div class="comment-div">
                      <strong>"{{rc.comment}}"</strong>
                    </div>
                  </div>

                </div>

                <ng-template #elseNotUser>
                  <div class="rating-comment">
                    <app-star-system
                    [rating]="rc.rating"></app-star-system>
                    from <em>{{rc.username}}</em>
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

  constructor(
    private rcService: RatingCommentService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {

    this.rcService.getAllRatingComments(this.recipeId)
    .subscribe( (rcResp: RatingComment[]) => {

      // We need to get the currently logged in user
      this.authService.getUserDetails()
      .subscribe( (userResp) => {

        this.currentUser = userResp;

        // Order the ratingComments so that current user's is at the top
        this.allRatingComments = rcResp;
        this.allRatingComments = this.allRatingComments.sort( rc => {
          if(rc.username === this.currentUser['username']) {
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

}
