import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";

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
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.image = ""; //need to be loaded from service
    //need to be loaded from service
    this.labels = [];
    let i = 0;
    for (; i < 10; i++) {
      //from service

      this.labels.push({
        name: "Item " + i,
        probability: Math.random(),
        wanted: true
      });
      this.counter = i + 1;
    }
  }
  itemClicked(e): void {
    if(!e.checked){
      this.counter--;
    }
    else{
        this.counter++;
      }
    console.log(e.value);
    console.log(this.counter);
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
    this.value = "";
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad OptionsPage");
  }
}
