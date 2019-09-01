import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiPictureProvider } from '../../providers/api-picture/api-picture';
import {ImageSnippet } from '../../app/classes/Image';
import { Label } from '../../app/classes/Label';
import { Observable } from 'rxjs';
/**
 * Generated class for the CameraPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-camera',
  templateUrl: 'camera.html',
  providers: [ApiPictureProvider]
})
export class CameraPage {
  
  selectedFile: ImageSnippet;
  // public apPic:ApiPictureProvider;
  constructor(public navCtrl: NavController, public navParams: NavParams, public apPic:ApiPictureProvider ) {
    console.log(apPic);
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad CameraPage');
  }
  loadedLabels: Label[];
 
  processFile($event):void {
    const file: File = $event.target.files[0];
    const reader = new FileReader();
    var preview; 
    reader.addEventListener('load', (event: any) => {
      preview = document.getElementById('preview');
      this.selectedFile = new ImageSnippet(event.target.result, file);

      this.selectedFile.pending = true;
      // this.imageService.uploadImage(this.selectedFile.file).subscribe(
      //   (res) => {
      //     this.onSuccess();
      //   },
      //   (err) => {
      //     this.onError();
      //   })
      preview.src = reader.result; 
    });

    reader.readAsDataURL(file);
  }
  getLabels(){
    // this.apPic.GetLabelsForPicture(this.selectedFile.src);
  }
  private onSuccess() {
    this.selectedFile.pending = false;
    this.selectedFile.status = 'ok';
  }

  private onError() {
    this.selectedFile.pending = false;
    this.selectedFile.status = 'fail';
    this.selectedFile.src = '';
  }

}