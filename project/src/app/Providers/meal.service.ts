import { Injectable } from '@angular/core';
import { Label } from '../../app/classes/Label';
import { Meal } from '../../app/classes/Meal';
import { Observable, of } from 'rxjs';
import {
  Http,
  Response,
  RequestOptions,
  ResponseContentType
} from '@angular/http';

import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpErrorResponse
} from '@angular/common/http';
import { Body } from '@angular/http/src/body';
// import "rxjs/add/operator/catch";
// import "rxjs/add/operator/debounceTime";
// import "rxjs/add/operator/distinctUntilChanged";
// import "rxjs/add/operator/map";
@Injectable({
  providedIn: 'root'
})
export class MealService {
  // baseURL = 'http://ce6dc86e.ngrok.io/api/';
  baseURL = 'http://localhost:54640/api/';
  // baseURL = 'http://b40029a0.ngrok.io/api/';
  // baseURL = 'http://localhost:54640/api/';
  listAllMeal:Meal[];
  constructor(public http: HttpClient) {
    console.log('Hello MealProvider Provider');
    this.listAllMeal=[];
  }

 

  public SaveToServer(path: string, hour: Date, labels: string[]): any {
    let _formData = new FormData();
    let meal = new Meal(path, hour, labels);
    _formData.append('path', path);
    // _formData.append("hour", hour.toDateString());
    const allLabels: string = labels.join(',');
    _formData.append('labels', allLabels);
    var res = this.http.post(this.baseURL + 'meal/upload', _formData);
    return new Promise(resolve => {
      res.subscribe(data => {
        resolve(data);
      });
    });
  }

  public GetTodayMeals(myDate: Date) {
    var res = this.http.get(this.baseURL + 'meal?dateTime=' + myDate.toDateString());
    return new Promise(resolve => {
      res.subscribe(data => {
        resolve(data);
      });
    });
  }


  public GetMealsForSearch(label: string) {
    // const myS: number = 1;
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
