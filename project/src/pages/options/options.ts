import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { ApiPictureProvider } from "../../providers/api-picture/api-picture";
import { Label } from "../../app/classes/Label";
import { Observable } from "rxjs";

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
  labels: Array<{ name: string; probability: number; wanted: boolean }> ;
  image: string;
  counter: number;
  tags: any;
  loaded = false;
  ngOnInit(){
    this.labels = new Array<{ name: string; probability: number; wanted: boolean }> ();
    // this.f1();
  }
  ionViewWillEnter(){
    // this.f1();
  }
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public apPic: ApiPictureProvider
  ) {
    this.labels = new Array<{ name: string; probability: number; wanted: boolean }> ();
    this.f1();
   

    this.image = "C:\\Users\\owner\\Downloads\\download (7).jpg"; //need to be loaded from service
    //need to be loaded from service
    // this.getLabels();
    this.labels = [];

  }
  itemClicked(e): void {
    if (!e.checked) {
      this.counter--;
    } else {
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

  resolveAfter2Seconds(x) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(
          this.apPic.GetLabels().then(data => {
            this.tags = data;
            console.log(this.tags);
            this.loaded = true;
          })
        );
      }, 4000);
    });
  }
loadedLabels: Label[];
  async f1() {
    var x = await this.resolveAfter2Seconds(10);
    this.loadedLabels = this.tags as Label[];
    let i = 0;
    for(; i< this.loadedLabels.length; i++){
    this.labels.push({
      name: this.loadedLabels[i].Name,
      probability: this.loadedLabels[i].Probability,
      wanted: true
    });
  }
    this.counter = i + 1;
  
    // this.tags = x;
    // console.log(this.tags);
    // console.log(x); // 10
}
     // let i = 0;
    // for (; i < 10; i++) {
      //from service

    //   this.labels.push({
    //     name: "Item " + i,
    //     probability: Math.random(),
    //     wanted: true
    //   });
    //   this.counter = i + 1;
    // }

  // public getLabels() {
  //   this.apPic.GetLabels().subscribe(res => {
  //     this.tags = res as Label[];
  //     console.log(this.tags);
  //     console.log(res);
  //   });
  // }
  // this.apPic.GetLabels().subscribe(data => {
  //   this.tags = data;
  //   console.log(this.tags);
  // });
  // console.log();
  // this.apPic.GetLabels().subscribe(val => console.log(val));
  // this.apPic.GetLabels();
  // .then(data => {
  //   this.tags = data as Label[];
  // });
   // this.f1();
    // this.load();
    // this.apPic.GetLabels().then(data => { works august 29 part 2, throws exceptions
    //   this.tags = data;
    //   console.log(data);
    // });

    // this.apPic.GetLabels().subscribe( works august 29, except for async
    //   res => {
    //     this.tags = res;
    //   },
    //   err => {
    //     console.log("sorry! there was an error!");
    //     console.error(err);
    //   }
    // );
  ionViewDidLoad() {
    console.log("ionViewDidLoad OptionsPage");
  }
}
