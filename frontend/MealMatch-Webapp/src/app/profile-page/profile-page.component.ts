import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-private-resource',
  template: `<h1> This is a private resource!! </h1>`
})
export class ProfilePageComponent implements OnInit {
  userId: number;
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    console.log("INITIALISING PROFILE PAGE");
    this.userId = this.authService.getLoggedInUserId();
    this.authService.getUserDetails().subscribe();

  }

}
