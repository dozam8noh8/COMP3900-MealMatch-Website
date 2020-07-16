import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private BASE_URL = 'http://localhost:5000/api'; // Our api calls will go to this URL

  constructor(private http: HttpClient) { }
  uploadProfileImage(file: File) {
    const formData = new FormData();
    formData.append('file', file );
    let url = `${this.BASE_URL}/profile_pic_upload`;
    return this.http.post(url, formData);
  }

  uploadRecipeImage(recipeId: number, file: File) {
    const formData = new FormData();
    formData.append('file', file );
    let url = `${this.BASE_URL}/recipe_image_upload/${recipeId}`;
    return this.http.post(url, formData);
  }

}
