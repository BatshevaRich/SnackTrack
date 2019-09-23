import { Injectable } from '@angular/core';
import { Meal } from '../../app/classes/Meal';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs-compat/operator/map';
import {mealLoaded} from '../home/home.page';
@Injectable({
  providedIn: 'root'
})
export class MealService {
  // baseURL = 'http://ce6dc86e.ngrok.io/api/';
  // baseURL = 'http://34.90.143.154/api/';
  // baseURL = 'http://b40029a0.ngrok.io/api/';
  baseURL = 'http://localhost:51786/api/';
  listAllMeal: Meal[];
  constructor(public http: HttpClient) {
    console.log('Hello MealProvider Provider');
    this.listAllMeal = [];
    this.http.get<Meal[]>(this.baseURL + 'meal').subscribe(meals => {
        console.log('load meal-servis');
        this.listAllMeal = meals;
      } ,
      err => {console.log(err); }
     );
  }

  public SaveToServer(path: string, hour: Date, labels: string[]): any {
    const formData = new FormData();
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
    return this.http.get(this.baseURL + 'meal');
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