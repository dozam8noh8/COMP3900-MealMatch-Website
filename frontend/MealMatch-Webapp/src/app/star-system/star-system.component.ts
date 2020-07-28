import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-star-system',
  styleUrls: ['./star-system.component.scss'],
  template: `
              <div *ngIf="true">
                <span class="filled-star"></span>

                <span *ngIf="rating < 2" class="empty-star"></span>
                <span *ngIf="rating >= 2" class="filled-star"></span>

                <span *ngIf="rating < 3" class="empty-star"></span>
                <span *ngIf="rating >= 3" class="filled-star"></span>

                <span *ngIf="rating < 4" class="empty-star"></span>
                <span *ngIf="rating >= 4 " class="filled-star"></span>

                <span *ngIf="rating < 5" class="empty-star"></span>
                <span *ngIf="rating == 5" class="filled-star"></span>              
              </div>

              
              <div *ngIf="false">
                if editable
                <span class="filled-star"></span>

                <span *ngIf="rating < 2" class="empty-star"></span>
                <span *ngIf="rating >= 2" class="filled-star"></span>

                <span *ngIf="rating < 3" class="empty-star"></span>
                <span *ngIf="rating >= 3" class="filled-star"></span>

                <span *ngIf="rating < 4" class="empty-star"></span>
                <span *ngIf="rating >= 4 " class="filled-star"></span>
                
                <span *ngIf="rating < 5" class="empty-star"></span>
                <span *ngIf="rating == 5" class="filled-star"></span>
              </div>
            `
})
export class StarSystemComponent implements OnInit {

  @Input() rating: number;
  filledStarURL: string;
  emptyStarURL: string;

  constructor() { }

  ngOnInit(): void {
  }

}
