import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RatingComment } from 'src/app/models/rating_comment';
import { RatingCommentService } from 'src/app/services/rating-comment.service';

@Component({
  selector: 'app-display-review',
  styleUrls: ['./display-review.component.scss'],
  template: `
              <mat-spinner *ngIf="isDeleting"></mat-spinner>
              <div *ngIf="!isDeleting && apiMessage">
                {{apiMessage}}
              </div>

              <div *ngIf="!isDeleting && !apiMessage">
                <ngb-rating 
                [(rate)]="review.rating"
                [max]="5"
                [readonly]="true">
                  <ng-template let-fill="fill" let-index="index">
                    <span class="star" [class.filled]="fill === 100">&#9733;</span>
                  </ng-template>
                </ngb-rating>

                <!-- If a user is logged in and the ratingComment belongs to this user -->
                <span *ngIf="currentUser && review.username === currentUser['username']">
                  This is your comment and rating
                  <button mat-raised-button color="warn" (click)="deleteReview()">Delete</button>
                  <button mat-raised-button color="primary" (click)="emitEditToggle()">Edit</button>
                </span>

                <span *ngIf="!currentUser || review.username !== currentUser['username']">
                  from <em>{{review.username}}</em>
                </span>
                
                <div class="comment-div">
                  <strong>"{{review.comment}}"</strong>
                </div>
              </div>
            `
})
export class DisplayReviewComponent implements OnInit {

  @Input() review: RatingComment;
  @Input() currentUser;

  // Function in parent that can be trigger in here
  @Output() toggleEditEmitter = new EventEmitter();

  isDeleting: boolean;
  apiMessage: string;

  constructor(
    private rcService: RatingCommentService
  ) { }

  ngOnInit(): void { }

  // Allows the press of edit button to trigger change in parent
  emitEditToggle() {
    this.toggleEditEmitter.emit();
  }

  deleteReview() {
    this.isDeleting = true;
    this.rcService.deleteRatingComment(this.review.id, this.currentUser['user_id'])
    .subscribe( resp => {
      // console.log(resp)
      this.apiMessage = resp['message']
      this.isDeleting = false;
    })
  }

}
