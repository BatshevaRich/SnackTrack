import { Injectable } from '@angular/core';
import { Meal } from '../../app/classes/Meal';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs-compat/operator/map';
import { MealLoaded } from '../home/home.page';
import { Storage } from '@ionic/storage';
import { debug } from 'util';
import {environment} from '../../environments/environment';
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
      this.params = new HttpParams();
      this.params = this.params.append('user', this.user1);
      this.params = this.params.append('name', this.userName);
      this.params = this.params.append('pass', this.userPass);
      console.log(res);
      this.listAllMeal = [];
      this.http.get<Meal[]>(this.baseURL + 'meal/getall', { params: this.params }).subscribe(meals => {
        this.listAllMeal = meals;
      },
        err => { console.log(err); }
      );
    });
  }
  baseURL = environment.baseURL;
  listAllMeal: Meal[];
  params: HttpParams;
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

  public GetTodayMeals(param: HttpParams) {
    const res = this.http.get(this.baseURL + 'meal/gettoday', { params: param });
    return new Promise(resolve => {
      res.subscribe(data => {
        resolve(data);
      });
    });
  }

  public GetMealsForSearch(param: HttpParams) {
    return this.http.get<Meal[]>(this.baseURL + 'meal/getlabels', { params: param });
  }

  public GetAllMeals(param: HttpParams) {
    return this.http.get(this.baseURL + 'meal/getall', { params: param });
  }

  getResults(): Observable<Meal[]> {
    let observable: Observable<Meal[]>;
    this.storage.get('auth-token').then(res => {
      const user = res as string;
      this.user1 = user;
      this.userName = user.substring(0, user.indexOf(','));
      this.userPass = user.substring(user.indexOf(',') + 1, user.length);
      this.params = new HttpParams();
      this.params = this.params.append('user', this.user1);
      this.params = this.params.append('name', this.userName);
      this.params = this.params.append('pass', this.userPass);
      console.log(res);

      if (this.listAllMeal.length === 0) {
        observable = this.http.get<Meal[]>(this.baseURL + 'meal/getall', { params: this.params });
      } else {
        observable = of(this.listAllMeal);
      }
    });
    return observable;
  }
}
