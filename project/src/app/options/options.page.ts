import { Component, ViewChild, Inject, LOCALE_ID } from '@angular/core';
import { LoadingController, AlertController, NavController } from '@ionic/angular';
import { ApiPictureService } from '../Providers/api-picture.service';
import { Label } from '../../app/classes/Label';
import { MealService } from '../providers/meal.service';
import { filter } from 'rxjs/operator/filter';
import {Storage} from '@ionic/storage';
// import { Route } from '@angular/compiler/src/core';
import { Router, NavigationExtras } from '@angular/router';
@Component({
  selector: 'app-options',
  templateUrl: './options.page.html',
  styleUrls: ['./options.page.scss']
})
export class OptionsPage {
  @ViewChild('box', null) userInput;
  constructor(private storage: Storage,
    private alertCtrl: AlertController,
    @Inject(LOCALE_ID) private locale: string,
    private navControl: NavController,
    private router: Router,
    public apPic: ApiPictureService,
    public loadingController: LoadingController,
    private mealProvider: MealService
  ) {
    
    this.load = true;
    this.loadLabelsFromAPI();
    // apPic.GetLabels();
    // init arrays
    this.labels = new Array<{
      name: string;
      wanted: boolean;
    }>();
    this.unwantedLabels = new Array<{
      name: string;
      wanted: boolean;
    }>();
    // this.paginationLimit = 5;
    this.labels = [];
    this.showAll = false;
    this.trues = 5;
    this.counter = 5;

  }
  labels: Array<{ name: string; wanted: boolean }>;
  unwantedLabels: Array<{ name: string; wanted: boolean }>;
  counter: number;
  tags: any;
  showAll: boolean;
  load: boolean;
  paginationLimit: number;
  loadedLabels: Label[];imageData:any;
  // imageData = localStorage.getItem('loadedImage');
  combinedLabels: string[];
  value = ''; // for ngmodel, to clean input box
  trues: number;
  private base64Image: string;
  ionViewWillEnter() {
    // this.imageData = localStorage.getItem('loadedImage');
    this.load = true;
    //this.base64Image = this.imageData;
    this.click = false;
  }
click: boolean;

  /**
   * asynchronous func to load labels from webapi
   * called by loadLabelsFromAPI func
   */
  resolveAfter2Seconds() {   
     return   this.storage.get("img").then((val) => {
          this.currentImage=val;
          this.imageData=val;
          this.base64Image=val;
          return new Promise(resolve => {
             // setTimeout(() => {
              resolve(
          // send the local storage base64 path
          this.apPic.InsertImages(val).then(data => {
            return data;
          })
        );
      // }, 400);
    });});
  }
  // ionic cordova run android --target=402000f30108aa829446
  /**
   * asynchronous func to load labels from webapi
   * marks as true only 5, all the rest are marked as false
   * called on page load
   */
  async loadLabelsFromAPI() {
this.tags = await this.resolveAfter2Seconds();
    this.loadedLabels = this.tags as Label[]; // this.tags is the result from webapi
    let i = 0;
    for (; i < 5; i++) {
      this.labels.push({
        name: this.loadedLabels[i].Name,
        wanted: true
      });
    }
    for(; i< this.loadedLabels.length; i++){
      this.unwantedLabels.push({
        name: this.loadedLabels[i].Name,
        wanted: true
      })
    }
    this.counter = 5;
  }

  /**
   * func to add label to chosen labels
   * called on add input of new label
   * @param e string of label value
   */
  addedLabel(added: string): void {
    if (!this.labels.some(l => l.name === added)) {
      if (!this.unwantedLabels.some(l => l.name === added)) {
        this.labels.push({
          name: added,
          wanted: true
        });
        this.counter = this.counter + 1;
        // this.unwantedLabels = this.unwantedLabels.filter(item => item.name !== added);
      } else {
        this.labels.push({
          name: added,
          wanted: true
        });
        this.counter = this.counter + 1; // increase number of labels
        this.unwantedLabels = this.unwantedLabels.filter(item => item.name !== added);
        // this.filterArraysByWanted();
      }
    }
    this.value = ''; // ngmodel
    this.click = false;
  }
  add() {
    this.click = true;
    // document.getElementById('addL').setFocus();
    this.userInput.setFocus();
  }
  moveToUnwanted($event) {
    console.log($event);
    this.unwantedLabels.push({ name: $event.toElement.id, wanted: false });
    console.log(this.unwantedLabels);
    this.counter = this.counter - 1;
    this.labels = this.labels.filter(item => item.name !== $event.toElement.id);
  }
  moveToWanted($event) {
    console.log($event);
    if (this.counter < 10) {
      this.labels.push({ name: $event.toElement.id, wanted: true });
      this.counter = this.counter + 1;
      console.log(this.labels);
      this.unwantedLabels = this.unwantedLabels.filter(item => item.name !== $event.toElement.id);
    }
  }
  /**
   * func to upload labels to server
   * called upon pressing the 'ok' button
   */
  uploadData() {
    let stringedLabels: string[]; // var to keep chosen strings
    stringedLabels = this.labels.filter(l => l.name).map(l => l.name);
    this.mealProvider.SaveToServer(
      // localStorage.getItem('loadedImage')
      this.base64Image, // path
      new Date(), // time
      stringedLabels // labels
    );
    localStorage.clear();
    // location.assign('/home');
    this.router.navigate(['/home']);
  }
  currentImage:any;


 setValue(key: string, value: any) {
  // this.storage.remove("key");
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
  // this.navCtrl.navigateRoot("/options"); // go to next page
}
}