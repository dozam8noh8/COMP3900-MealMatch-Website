import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RatingComment } from '../models/rating_comment';

@Injectable({
  providedIn: 'root'
})
export class RatingCommentService {

  private BASE_URL = 'http://localhost:5000/api';

  constructor(
    private http: HttpClient
  ) { }

  getAllRatingComments(recipeId: number) {
    let url = `${this.BASE_URL}/rating/${recipeId}`;
    return this.http.get<RatingComment[]>(url);
  }
}
