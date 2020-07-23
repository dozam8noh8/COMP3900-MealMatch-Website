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
  <span>Select Image</span>
  <input #imageInput
         type="file"
         accept="image/*"
         (change)="processFile(imageInput)">
  
  <!-- Profile has own displaying of image, so only show the follow if for recipe -->
  <img *ngIf="isForRecipe" [src]="temporaryImageURL" height="200"> <br/>
</label>
`
})
// https://www.freecodecamp.org/news/how-to-make-image-upload-easy-with-angular-1ed14cb2773b/

export class PhotoUploadComponent {

  selectedFile: ImageSnippet;
  @Output() uploadEmitter = new EventEmitter<File>();
  @Input() isForRecipe: boolean;
  temporaryImageURL;
  constructor(){}

  processFile(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', (event: any) => {

      this.selectedFile = new ImageSnippet(event.target.result, file);
      this.uploadEmitter.emit(this.selectedFile.file);
    });

    reader.readAsDataURL(file);
    reader.onload = (event) => {
      this.temporaryImageURL = event.target.result;
    }
  }
}