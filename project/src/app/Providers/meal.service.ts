import { Injectable } from '@angular/core';
import { Label } from '../../app/classes/Label';
import { Meal } from '../../app/classes/Meal';
import { Observable } from 'rxjs';
import {
  Http,
  Response,
  RequestOptions,
  ResponseContentType
} from '@angular/http';
// import "rxjs/add/operator/catch";
// import "rxjs/add/operator/debounceTime";
// import "rxjs/add/operator/distinctUntilChanged";
// import "rxjs/add/operator/map";
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpErrorResponse
} from '@angular/common/http';
import { Body } from '@angular/http/src/body';

@Injectable({
  providedIn: 'root'
})
export class MealService {
  constructor(public http: HttpClient) {
    console.log('Hello MealProvider Provider');
  }

  baseURL = 'http://b40029a0.ngrok.io/api/';
  // baseURL = 'http://localhost:54640/api/';
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
    const myS: number = 1;
    var res = this.http.get(this.baseURL + 'meal?dateTime=' + myS);
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
}
