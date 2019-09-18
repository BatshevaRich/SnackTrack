import { Injectable } from '@angular/core';
import { Meal } from '../../app/classes/Meal';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MealService {
  // baseURL = 'http://ce6dc86e.ngrok.io/api/';
  baseURL = 'http://localhost:54640/api/';
  // baseURL = 'http://b40029a0.ngrok.io/api/';
  // baseURL = 'http://localhost:54640/api/';
  listAllMeal: Meal[];
  constructor(public http: HttpClient) {
    console.log('Hello MealProvider Provider');
    this.listAllMeal = [];
  }

  public SaveToServer(path: string, hour: Date, labels: string[]): any {
    const formData = new FormData();
    formData.append('path', path);
    formData.append("hour",hour.toString().replace(" GMT+0300 (שעון ישראל (קיץ))",""));
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
    const res = this.http.get(this.baseURL + 'meal');
    return new Promise(resolve => {
      res.subscribe(data => {
        resolve(data);
      });
    });
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
