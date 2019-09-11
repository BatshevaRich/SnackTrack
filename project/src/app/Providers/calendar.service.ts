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
export class CalendarService {

  constructor(public http: HttpClient) {
    console.log('Hello Calendar Provider');
  }
  // baseURL = 'http://b40029a0.ngrok.io/api/calendar';
  baseURL = 'http://localhost:54640/api/calendar';

  public LoadFoodsFromServerForDay(month: Date) {
    const res = this.http.get(this.baseURL + '/gettoday/' + month.toDateString());
    return new Promise(resolve => {
      res.subscribe(data => {
        resolve(data);
      });
    });

  }


}
