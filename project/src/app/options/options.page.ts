import { Component, ViewChild } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { ApiPictureService } from '../Providers/api-picture.service';
import { Label } from '../../app/classes/Label';
import { MealService } from '../providers/meal.service';
import { filter } from 'rxjs/operator/filter';
@Component({
  selector: 'app-options',
  templateUrl: './options.page.html',
  styleUrls: ['./options.page.scss']
})
export class OptionsPage {
  @ViewChild('box', null) userInput;
  constructor(
    public apPic: ApiPictureService,
    public loadingController: LoadingController,
    private mealProvider: MealService
  ) {
    this.load = true;
    this.loadLabelsFromAPI();
    // init arrays
    this.labels = new Array<{
      name: string;
      probability: number;
      wanted: boolean;
    }>();
    this.unwantedLabels = new Array<{
      name: string;
      probability: number;
      wanted: boolean;
    }>();
    this.combinedLabels = [];
    // this.paginationLimit = 5;
    this.labels = [];
    this.showAll = false;
    this.trues = 5;
    this.counter = 5;
    this.base64Image = this.imageData;
  }
  labels: Array<{ name: string; probability: number; wanted: boolean }>;
  unwantedLabels: Array<{ name: string; probability: number; wanted: boolean }>;
  counter: number;
  tags: any;
  showAll: boolean;
  load: boolean;
  paginationLimit: number;
  loadedLabels: Label[];
  imageData = localStorage.getItem('loadedImage');
  combinedLabels: string[];
  value = ''; // for ngmodel, to clean input box
  trues: number;
  private base64Image: string;
  ionViewWillEnter() {
    this.imageData = localStorage.getItem('loadedImage');
    this.load = true;
    this.base64Image = this.imageData;
  }
  /**
   * func to increase/decrease counter of selected labels
   * also sorts list by trues/not, so the trues are in the beginnig of the list
   * called on click of checkbox
   * @param e the checkbox html element
   */

   filterArraysByWanted() {
    this.combinedLabels = [];
    this.unwantedLabels.filter(userL => {
      if (userL.wanted === true) {
        this.combinedLabels.push(userL.name);
      }
    });

    this.trues = 0;
    this.labels.filter(clarifaiL => {
      if (clarifaiL.wanted === true) {
        this.trues = this.trues + 1;
        this.combinedLabels.push(clarifaiL.name);
      }
    });
    alert(this.combinedLabels);
    this.labels.sort((a, b) => a.wanted < b.wanted ? 1 : a.wanted > b.wanted ? -1 : 0);
   }
  /**
   * asynchronous func to load labels from webapi
   * called by loadLabelsFromAPI func
   */
  resolveAfter2Seconds() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(
          // send the local storage base64 path
          this.apPic.InsertImages(this.imageData).then(data => {
            this.tags = data;
            console.log(this.tags.length);
          })
        );
      }, 400);
    });
  }
// ionic cordova run android --target=402000f30108aa829446
  /**
   * asynchronous func to load labels from webapi
   * marks as true only 5, all the rest are marked as false
   * called on page load
   */
  async loadLabelsFromAPI() {
    await this.resolveAfter2Seconds();
    this.loadedLabels = this.tags as Label[]; // this.tags is the result from webapi
    let i = 0;
    for (; i < this.loadedLabels.length; i++) {
      this.labels.push({
        name: this.loadedLabels[i].Name,
        probability: this.loadedLabels[i].Probability,
        wanted: true
      });
    }
    this.counter = i;
  }

  /**
   * func to add label to chosen labels
   * called on add input of new label
   * @param e string of label value
   */
  addedLabel(added: string): void {
    this.labels.push({
      name: added,
      probability: 1,
      wanted: true
    });
    this.counter = this.counter + 1; // increase number of labels
    // this.filterArraysByWanted();
    this.value = ''; // ngmodel
  }
  add(){
    this.userInput.setFocus();
  }
  moveToUnwanted($event){
    console.log($event);
    this.unwantedLabels.push({name: $event.toElement.id,probability: 1,wanted: false});
    console.log(this.unwantedLabels);
    this.labels = this.labels.filter(item => item.name != $event.toElement.id);
  }
  moveToWanted($event){
    console.log($event);
    this.labels.push({name: $event.toElement.id,probability: 1,wanted: true});
    console.log(this.labels);
    this.unwantedLabels = this.unwantedLabels.filter(item => item.name != $event.toElement.id);
  }
  /**
   * func to upload labels to server
   * called upon pressing the 'ok' button
   */
  uploadData() {
    console.log(this.combinedLabels);
    let stringedLabels: string[]; // var to keep chosen strings
    stringedLabels = this.combinedLabels.filter(l => l).map(l => l);
    this.mealProvider.SaveToServer(
      localStorage.getItem('loadedImage'), // path
      new Date(), // time
      stringedLabels // labels
    );
    // localStorage.clear();
    alert('uploaded');
  }
}
