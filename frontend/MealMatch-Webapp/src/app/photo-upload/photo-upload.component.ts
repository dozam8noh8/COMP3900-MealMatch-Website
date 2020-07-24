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
  <br/>

  <img *ngIf="existingImageURL" [src]="existingImageURL" height="200"> <br/>
</label>
`
})
// https://www.freecodecamp.org/news/how-to-make-image-upload-easy-with-angular-1ed14cb2773b/

export class PhotoUploadComponent {

  selectedFile: ImageSnippet;
  @Output() uploadEmitter = new EventEmitter<File>();
  @Input() existingImageURL;
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
      // The URL for the image can be changed to a sort of temporary URL that the file reader keeps when an event (file selection) occurs
      this.existingImageURL = event.target.result;
    }
  }
}