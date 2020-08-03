import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RatingComment } from 'src/app/models/rating_comment';
import { RatingCommentService } from 'src/app/services/rating-comment.service';
import { MatDialog } from '@angular/material/dialog';
import { DangerousActionPopupComponent } from 'src/building-components/dangerous-action-popup/dangerous-action-popup.component';
import { finalize } from 'rxjs/operators';

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
  @Output() deleteEmitter = new EventEmitter();

  isDeleting: boolean;
  apiMessage: string;

  constructor(
    private rcService: RatingCommentService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void { }

  // Allows the press of edit button to trigger change in parent
  emitEditToggle() {
    this.toggleEditEmitter.emit();
  }

  deleteReview() {
    let dialogRef = this.dialog.open(DangerousActionPopupComponent);
    dialogRef.componentInstance.description = "Deleting Review";
    dialogRef.componentInstance.question = "Are you sure you want to delete your review?"
    
    dialogRef.afterClosed().subscribe(emitted => {
      if(emitted?.behaviour === "Yes") {
        this.isDeleting = true;
        this.rcService.deleteRatingComment(this.review.id, this.currentUser['user_id'])
        .pipe(finalize(() => {this.isDeleting = false}))
        .subscribe( resp => {
          if (resp['statusCode'] === 201){
            this.deleteEmitter.emit();
          }
          this.apiMessage = resp['message']
        });
      }
    })
  }

}
