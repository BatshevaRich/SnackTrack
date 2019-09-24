import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { MealService } from '../Providers/meal.service';
import { Meal } from '../classes/Meal';
import { AutoCompleteLabelsService } from '../Providers/auto-complete-labels.service';
import { CameraOptions, Camera } from '@ionic-native/camera/ngx';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage {
  // constructor(private route: ActivatedRoute,
  //             private router: Router,
  //             public mealService: MealService,
  //             public autoCompleteLabelsService: AutoCompleteLabelsService) {
  //   this.display = false;
  //   this.route.queryParams.subscribe(params => {
  //     if (params && params.special) {
  //       this.data = JSON.parse(params.special);
  //       this.searchText = this.data;
  //       this.loadLabelsFromAPI();
  //     }
  //   });
  // }

  meals: Meal[] = [];
  data: any;
  myMeal: any;
  display: boolean;
  load: any;
  searchText = '';

  onSelected() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        special: JSON.stringify(this.searchText)
      }
    };
    this.searchText = '';
    this.router.navigate(['/search'], navigationExtras);
  }
  constructor(private camera: Camera,
    private storage: Storage,private route: ActivatedRoute, private router: Router, public mealService: MealService
    ,public autoCompleteLabelsService: AutoCompleteLabelsService) {

    this.display = false;
    // alert(this.display);

    console.log(this.meals);
    this.route.queryParams.subscribe(params => {
        if (params && params.special) {
          this.data = JSON.parse(params.special);
this.searchText=this.data;
          this.loadLabelsFromAPI();
          };
        });



  }

  resolveAfter2Seconds() {
    return new Promise(resolve => {
      resolve(
        this.mealService.GetMealsForSearch(this.data).then((mealk: Meal[]) => {
          this.meals = mealk;
          console.log(this.meals);
          return mealk;
        }));
    });
  }
  async loadLabelsFromAPI() {
    this.meals = await this.resolveAfter2Seconds() as Meal[];
    // alert(this.meals);
    this.display=false;
    if (this.meals.length == 0) {
      this.display=true;
    }
  }
  currentImage: any;


  takePicture($event) {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };
    this.camera.getPicture(options).then((imageData) => {
      this.currentImage = imageData;
      // 'data:image/jpeg;base64,'
      // alert(this.currentImage);
      this.storage.set('img', 'data:image/jpeg;base64,'+ this.currentImage).then((response) => {
        this.router.navigate(['/options']);

      }).catch((error) => {
        console.log('set error for ' + this.currentImage + ' ', error);
      });
      
    }, (err) => {
      console.log('Camera issue:' + err);
    });
  }
  setValue(key: string, value: any) {
    this.storage.set(key, value).then((response) => {
    }).catch((error) => {
      console.log('set error for ' + key + ' ', error);
    });
    this.storage.set(key, value);
  }

  sendImage3($event): void {
    const file: File = $event.target.files[0];
    const reader = new FileReader();
    this.storage.clear();
    reader.onload = (event: any) => {
      this.setValue('img', event.target.result);
      this.router.navigate(['/options']);
    };
    reader.readAsDataURL(file);
  }

}


