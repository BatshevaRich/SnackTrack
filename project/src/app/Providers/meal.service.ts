import { Injectable } from '@angular/core';
import { Meal } from '../../app/classes/Meal';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs-compat/operator/map';
import { MealLoaded } from '../home/home.page';
import { Storage } from '@ionic/storage';
import { debug } from 'util';
@Injectable({
  providedIn: 'root'
})
export class MealService {
  constructor(private storage: Storage, public http: HttpClient) {
    this.storage.get('auth-token').then(res => {
      const user = res as string;
      this.user1 = user;
      this.userName = user.substring(0, user.indexOf(','));
      this.userPass = user.substring(user.indexOf(',') + 1, user.length);
      console.log(res);
    });
    this.listAllMeal = [];
    this.http.get<Meal[]>(this.baseURL + 'meal').subscribe(meals => {
      this.listAllMeal = meals;
      alert(this.listAllMeal);
    },
      err => { console.log(err); }
    );
  }
  // baseURL = 'http://ce6dc86e.ngrok.io/api/';
  baseURL = 'http://34.90.143.154/api/';
  // baseURL = 'http://b40029a0.ngrok.io/api/';
  // baseURL = 'http://localhost:51786/api/';
  listAllMeal: Meal[];

  userName: string;
  userPass: string;
  user1: string;

  public SaveToServer(user: string, name: string, pass: string, path: string, hour: Date, labels: string[]): any {
    const formData = new FormData();
    formData.append('user', user);
    formData.append('name', name);
    formData.append('pass', pass);
    formData.append('path', path);
    formData.append('hour', hour.toString().replace(' GMT+0300 (שעון ישראל (קיץ))', ''));
    const allLabels: string = labels.join(',');
    formData.append('labels', allLabels);
    const res = this.http.post(this.baseURL + 'meal/upload', formData);
    return new Promise(resolve => {
      res.subscribe(data => {
        resolve(data);
      });
    });
  }

  public GetTodayMeals(myDate: Date) {
    const res = this.http.get(this.baseURL + 'meal?dateTime=' + myDate.toDateString());
    return new Promise(resolve => {
      res.subscribe(data => {
        resolve(data);
      });
    });
  }

  public GetMealsForSearch(label: string) {
    const res = this.http.get<Meal[]>(this.baseURL + 'meal?label=' + label);
    return new Promise(resolve => {
      res.subscribe(data => {
        resolve(data);
      });
    });
  }

  public GetAllMeals() {
    let params = new HttpParams();
    params = params.append('user', this.user1);
    params = params.append('name', this.userName);
    params = params.append('pass', this.userPass);
    return this.http.get(this.baseURL + 'meal/getall', { params });
  }

  getResults(): Observable<Meal[]> {
    let observable: Observable<Meal[]>;
    if (this.listAllMeal.length === 0) {
      observable = this.http.get<Meal[]>(this.baseURL + 'meal');
    } else {
      observable = of(this.listAllMeal);
    }
    return observable;
  }
}
