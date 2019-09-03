import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  Loading
} from "ionic-angular";
import { ApiPictureProvider } from "../../providers/api-picture/api-picture";
import { Label } from "../../app/classes/Label";
import { Observable } from "rxjs";
import { ImageSnippet } from "../../app/classes/Image";
import { SpinnerDialog } from "@ionic-native/spinner-dialog/ngx";
import { NgZone } from "@angular/core";
/**
 * Generated class for the OptionsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-options",
  templateUrl: "options.html"
})
export class OptionsPage {
  labels: Array<{ name: string; probability: number; wanted: boolean }>;
  image: string;
  counter: number;
  tags: any;
  loaded = false;
  show10: boolean;
  paginationLimit: number;
  lengthOfLabels: number;
  // ngOnInit() {
  //   this.labels = new Array<{
  //     name: string;
  //     probability: number;
  //     wanted: boolean;
  //   }>();
  // }
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public apPic: ApiPictureProvider,
    public loadingController: LoadingController,
    private zone: NgZone
  ) {
    this.labels = new Array<{
      name: string;
      probability: number;
      wanted: boolean;
    }>();
    this.paginationLimit = 5;
    this.f1();
    this.labels = [];
    this.show10 = false;
  }
  loadedLabels: Label[];
  itemClicked(e): void {
    if (!e.checked) {
      this.counter--;
    } else {
      if (this.counter < 10) this.counter++;
    }
    console.log(e.value);
    console.log(this.counter);
    console.log(this.labels);
  }
  value = "";

  addedLabel(e): void {
    console.log(e);
    this.labels.push({
      name: e,
      probability: 1,
      wanted: true
    });
    this.counter = this.counter + 1;
    console.log(this.counter);
    this.lengthOfLabels = this.lengthOfLabels +1;
    this.value = "";
    console.log(this.labels);
    this.labels.sort((a, b) => a.probability < b.probability ? 1 : a.probability > b.probability ?-1 : 0)
    alert(this.labels);
  }
  imageData = localStorage.getItem("loadedImage");
  resolveAfter2Seconds() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(
          // this.apPic.GetLabels().then(data => {
          this.apPic.InsertImages(this.imageData).then(data => {
            this.tags = data;
            this.loaded = true;
          })
        );
      }, 200);
    });
  }
  public update($event) {
    console.log(event);
    console.log("Segment clicked! " + $event.value, this, event);
    this.show10 = !this.show10;
      console.log(this.show10);
      if (this.paginationLimit == this.lengthOfLabels) this.paginationLimit = 5;
      else this.paginationLimit = this.lengthOfLabels;
    if (this.labels.length > 0) {
      
    }
  }
  async f1() {
    var x = await this.resolveAfter2Seconds();

    this.loadedLabels = this.tags as Label[];
    let i = 0;
    for (; i < this.paginationLimit; i++) {
      this.labels.push({
        name: this.loadedLabels[i].Name,
        probability: this.loadedLabels[i].Probability,
        wanted: true
      });
    }
    for (; i < this.loadedLabels.length; i++) {
      this.labels.push({
        name: this.loadedLabels[i].Name,
        probability: this.loadedLabels[i].Probability,
        wanted: false
      });
    }
    console.log(this.labels);
    this.lengthOfLabels = this.labels.length;
    this.counter = this.paginationLimit;
  }
  selectedFile: ImageSnippet;
}
