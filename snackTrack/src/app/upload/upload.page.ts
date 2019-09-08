import { Component } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
import { MealService } from '../Providers/meal.service';
import { ImageSnippet } from '../../app/classes/Image';
import { Label } from '../../app/classes/Label';
import { Observable } from 'rxjs';
import { OptionsPage } from '../options/options.page';
import { ApiPictureService } from '../Providers/api-picture.service';
import { CalendarComponent } from 'ionic2-calendar/calendar';
import { ViewChild, Inject, LOCALE_ID } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { formatDate } from '@angular/common';
import { Variable } from '@angular/compiler/src/render3/r3_ast';
import { Router, NavigationExtras } from '@angular/router';
@Component({
  selector: 'app-upload',
  templateUrl: './upload.page.html',
  styleUrls: ['./upload.page.scss']
})
export class UploadPage {
  // constructor(
  //   public navCtrl: NavController,
  //   // public navParams: NavParams,
  //   // @Inject(LOCALE_ID) private locale: string,
  //   // private router: Router,
  //   public apPic: ApiPictureService,
  //   public meal: MealService,
  // ) {
  //   // meal.GetTodayMeals(new Date(2019, 9, 4, 1, 22, 41));
  // }
  constructor(

    private alertCtrl: AlertController,
    @Inject(LOCALE_ID) private locale: string,
    private router: Router
  ) {}
  selectedFile: ImageSnippet;
  loadedLabels: Label[];
  fileToUpload: File = null;
  urls: string[] = new Array();
  processing: boolean;
  uploadImage: any;
  /**
   * processes the file, saves a base64 string in the local storage, and opens options page
   * @param $event the input file html object
   */
  sendImage($event): void {
    const file: File = $event.target.files[0];
    const reader = new FileReader();
    reader.onload = (event: any) => {
      localStorage.clear();
      localStorage.setItem('loadedImage', event.target.result);
    };
    reader.readAsDataURL(file);
    this.router.navigate(['/options']);
    // this.navCtrl.navigateRoot("/options"); // go to next page
  }

  imageLoaded() {
    this.processing = false;
  }
}
