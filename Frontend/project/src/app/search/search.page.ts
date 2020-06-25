import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { MealService } from '../Providers/meal.service';
import { Meal } from '../classes/Meal';
import { AutoCompleteLabelsService } from '../Providers/auto-complete-labels.service';
import { CameraOptions, Camera } from '@ionic-native/camera/ngx';
import { Storage } from '@ionic/storage';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage {
  constructor(private camera: Camera,
    private storage: Storage,
    private route: ActivatedRoute,
    private router: Router,
    public mealS: MealService,
    public autoCompleteLabelsService: AutoCompleteLabelsService) {
    this.display = false;
    console.log(this.meals);
    this.route.queryParams.subscribe(params => {
      if (params && params.special) {
        this.data = JSON.parse(params.special);
        this.searchText = this.data;
        this.loadLabelsFromAPI();
      }
    });
  }

  meals: Meal[] = [];
  data: any;
  myMeal: any;
  display: boolean;
  load: any;
  searchText = '';
  currentImage: any;

  onSelected() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        special: JSON.stringify(this.searchText)
      }
    };
    this.searchText = '';
    this.router.navigate(['/search'], navigationExtras);
  }
  userName: string;
  userPass: string;
  loadLabelsFromAPI() {
    this.storage.get('auth-token').then(res => {
      const user = res as string;
      const user1: string = user;
      this.userName = user.substring(0, user.indexOf(','));
      this.userPass = user.substring(user.indexOf(',') + 1, user.length);
      let params = new HttpParams();
      params = params.append('user', user1);
      params = params.append('name', this.userName);
      params = params.append('pass', this.userPass);
      console.log(res);
      let param = new HttpParams();
      param = param.append('label', this.data);
      param = param.append('user', user1);
      param = param.append('name', this.userName);
      param = param.append('pass', this.userPass);
      return this.mealS.GetMealsForSearch(param).subscribe(res => {
        this.meals = res;
        this.display = false;
        if (this.meals.length === 0) {
          this.display = true;
        }
      })
    })
  }

  takePicture($event) {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      // targetWidth: 900,
      // targetHeight: 600,
      saveToPhotoAlbum: false,
      allowEdit: false,
      sourceType: 1
    };
    this.camera.getPicture(options).then((imageData) => {
      //this.storage.clear();
      this.currentImage = imageData;
      this.storage.set('img', 'data:image/jpeg;base64,' + this.currentImage).then((response) => {
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
    //this.storage.clear();
    reader.onload = (event: any) => {
      this.setValue('img', event.target.result);
      this.router.navigate(['/options']);
    };
    reader.readAsDataURL(file);
  }

}


