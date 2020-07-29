import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-display-review',
  styleUrls: ['./display-review.component.scss'],
  template: `
                <ngb-rating 
                [(rate)]="rating"
                [max]="5"
                [readonly]="true">
                  <ng-template let-fill="fill" let-index="index">
                    <span class="star" [class.filled]="fill === 100">&#9733;</span>
                  </ng-template>
                </ngb-rating>

                <!-- If a user is logged in and the ratingComment belongs to this user -->
                <span *ngIf="currentUser && username === currentUser">
                  This is your comment and rating <button mat-raised-button color="primary" (click)="emitEditToggle()">Edit</button>
                </span>

                <span *ngIf="!currentUser || username !== currentUser">
                  from <em>{{username}}</em>
                </span>
                
                <div class="comment-div">
                  <strong>"{{comment}}"</strong>
                </div>
            `
})
export class DisplayReviewComponent implements OnInit {

  @Input() rating: number;
  @Input() username: string;
  @Input() comment: string;
  @Input() currentUser: string;
  @Output() toggleEditEmitter = new EventEmitter();

  constructor() { }

  ngOnInit(): void { }

  emitEditToggle() {
    this.toggleEditEmitter.emit();
  }

}
