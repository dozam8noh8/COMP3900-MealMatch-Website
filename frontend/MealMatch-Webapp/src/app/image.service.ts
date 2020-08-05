import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
/* The image service handles the api interactions relating to
image uploading. Profile images are returned by auth service in get_user_details api call. */
export class ImageService {
  // Our api calls will go to this URL
  private BASE_URL = 'http://localhost:5000/api';

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
