import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RatingComment } from '../models/rating_comment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RatingCommentService {

  private BASE_URL = 'http://localhost:5000/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getAllRatingComments(recipeId: number) {
    let url = `${this.BASE_URL}/rating/${recipeId}`;
    return this.http.get<RatingComment[]>(url);
  }

  postRatingComment(recipeId: number, rating: number, comment: string) {
    let url = `${this.BASE_URL}/rating/${recipeId}`;
    let body = {
      "rating": rating,
      "comment": comment,
      "user_id": this.authService.getLoggedInUserId()
    }
    console.log(body)
    return this.http.post(url, body);
  }

}
