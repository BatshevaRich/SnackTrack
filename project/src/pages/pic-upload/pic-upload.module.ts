import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PicUploadPage } from './pic-upload';

@NgModule({
  declarations: [
    PicUploadPage,
  ],
  imports: [
    IonicPageModule.forChild(PicUploadPage),
  ],
})
export class PicUploadPageModule {}
