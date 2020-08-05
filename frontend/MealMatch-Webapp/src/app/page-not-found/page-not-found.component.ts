import { Component } from '@angular/core';

@Component({
    selector: 'app-page-not-found',
    styleUrls: ['page-not-found.component.scss'],
    template: `
                <div class="main-div" style="padding-top:20%">
                  <mat-card style="width:50%; margin: auto; border-radius:25px">
                    <div layout="row" layout-fill layout-align="center center">
                        <h1 style="font-weight: heavier; font-size: 3em" class="copperplate">We're Sorry</h1>
                        <h1 style="font-weight: lighter; font-size: 1.5em" class="copperplate">The page you're looking for does not exist</h1>
                        <button mat-raised-button color="primary" class="copperplate submitButton" routerLink="/home">Go to home page</button>
                    </div>
                  </mat-card>
                </div>
              `
})

export class PageNotFoundComponent {
    constructor(){}
}