import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Storage } from '@ionic/storage';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.page.html',
  styleUrls: ['./camera.page.scss'],
})
export class CameraPage implements OnInit {

  currentImage: any;

  constructor(private camera: Camera,public storage:Storage,public router:Router) { }

  ngOnInit() {
  }
  takePicture() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 900,
      targetHeight: 600,
      saveToPhotoAlbum: false,
      allowEdit: true,
      sourceType: 1
    };

    this.camera.getPicture(options).then((imageData) => {
      this.currentImage = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      console.log('Camera issue:' + err);
    });
  }
  setValue(key: string, value: any) {
    this.storage.set(key, value).then((response) => {
    }).catch((error) => {
      console.log('set error for ' + key + ' ', error);
    });
    this.storage.set(key,value);
  }
  
  sendImage($event): void {
    const file: File = $event.target.files[0];
    const reader = new FileReader();
    reader.onload = (event: any) => {
      this.setValue("img",event.target.result);
    };
    reader.readAsDataURL(file);
    this.router.navigate(['/options']);
  }
}
