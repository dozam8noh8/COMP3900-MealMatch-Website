import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { ImageService } from '../image.service';


class ImageSnippet {
  constructor(public src: string, public file: File) {}
}

@Component({
  selector: 'app-photo-upload',
  styleUrls: ['./photo-upload.component.scss'],
  template: `
  <label class="image-upload-container btn btn-bwm">
  <!-- <span style="margin-right: 2.5vw;">Select Image</span> -->
  <div class="preview-image">
    <img *ngIf="existingImageURL && !loading" [src]="existingImageURL"> <br>
    <mat-spinner *ngIf="loading"> </mat-spinner>
  </div>
  <input #imageInput
         type="file"
         accept="image/*"
         (change)="processFile(imageInput)"
         style="margin-top: 20px;">
  <br>
</label>
`
})
/* The photo upload component is a reusable component that allows users to add
files on their computer as photos to our system. When a photo is selected and confirmed,
it will be sent to our backend and hosted in the static folder. 
Code adapted from:
// https://www.freecodecamp.org/news/how-to-make-image-upload-easy-with-angular-1ed14cb2773b/
*/
export class PhotoUploadComponent {
  // Emits to the parent component when we load the file
  @Output() uploadEmitter = new EventEmitter<File>();
  // The path of the image that the photo upload component is currently displaying.
  // this may be a temporary url or passed in from the parent as a placeholder.
  @Input() existingImageURL: string | ArrayBuffer;
  @Input() loading: boolean;

  private selectedFile: ImageSnippet;

  constructor(){}

  processFile(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();
    // When an image is loaded, we convert it into an image snippet so we can show users a preview.
    reader.addEventListener('load', (event: any) => {

      this.selectedFile = new ImageSnippet(event.target.result, file);
      // Emit the file to the parent to be sent in api request.
      this.uploadEmitter.emit(this.selectedFile.file);
    });

    reader.readAsDataURL(file);
    reader.onload = (event) => {
      // The URL for the image can be changed to a sort of temporary URL
      // that the file reader keeps when an event (file selection) occurs
      this.existingImageURL = event.target.result;
    }
  }
}