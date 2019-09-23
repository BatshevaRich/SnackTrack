import { Injectable } from '@angular/core';
import { Meal } from '../../app/classes/Meal';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs-compat/operator/map';
import {mealLoaded} from '../home/home.page';
import { Variable } from '@angular/compiler/src/render3/r3_ast';
import { CalendarEvent } from 'angular-calendar';
import { start } from 'repl';import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';
import { ApiPictureService } from './api-picture.service';
import { AutoCompleteLabelsService } from './auto-complete-labels.service';

export interface mealLoaded {
  Path: string;
  DateOfPic: string;
  Labels: string[];
}
@Injectable({
  providedIn: 'root'
})
export class MealService {
  // baseURL = 'http://ce6dc86e.ngrok.io/api/';
  baseURL = 'http://localhost:54640/api/';
   //baseURL = 'http://d2feee8e.ngrok.io/api/';
  // baseURL = 'http://localhost:54640/api/';
  listAllMealToCalendar: Meal[];

  count:any;
  constructor(public http: HttpClient) {
    this.count=-1;
    this.listAllMealToCalendar=[];
    
    this.listAllMealToCalendar= this.GetMonthMeals(new Date());
    // this.http.get<Meal[]>(this.baseURL + 'meal').subscribe(meals => {
    //     this.listAllMeal = meals;
    //   } ,
    //   err => {console.log(err); }
    //  );
  }

  public SaveToServer(path: string, hour: Date, labels: string[]): any {
    const formData = new FormData();
    formData.append('path', path);
    let e:Meal;
    e.hour= hour;
    e.path=path;
    e.categories=labels;
    AutoCompleteLabelsService.prototype.addLabels(labels);
    this.listAllMealToCalendar.push(e);
    formData.append('hour', hour.toString().replace(' GMT+0300 (שעון ישראל (קיץ))',''));
    const allLabels: string = labels.join(',');
    formData.append('labels', allLabels);
    const res = this.http.post(this.baseURL + 'meal/upload', formData);
    return new Promise(resolve => {
      res.subscribe(data => {
        resolve(data);
      });
    });
  }
  
  public  GetTodayMeals(myDate: Date) {
    let meals:Meal[];
    for(let i=0;i<this.listAllMealToCalendar.length;i++)
    if(this.listAllMealToCalendar[i].hour.getDay==myDate.getDay&&
      this.listAllMealToCalendar[i].hour.getMonth==myDate.getMonth&&this.listAllMealToCalendar[i].hour.getFullYear==myDate.getFullYear)
      meals.push(this.listAllMealToCalendar[i]);
   return meals;
   // const res = this.http.get(this.baseURL + 'meal?dateTime=' + myDate.toDateString());
    // return new Promise(resolve => {
    //   res.subscribe(data => {
    //     resolve(data);
    //   });
    // });
  }
  public GetMonthMeals(myDate: Date) {
    let e:Meal[];
      e=[];
    if(this.count<new Date().getMonth()-myDate.getMonth())
    {
      
      this.count++;
      const res = this.http.get(this.baseURL + 'meal?dateTime=' + myDate.toDateString());
     new Promise(resolve => {
      res.subscribe(data => {
        resolve(data);
      });
    }).then((data)=>{
      
     e=data as Meal[];
     e.forEach(t=>this.listAllMealToCalendar.push(t));
     return e;
    }
    )
  }
  for(let i=0;i< this.listAllMealToCalendar.length;i++)
  if(new Date(this.listAllMealToCalendar[i].hour).getMonth()==myDate.getTime())
   e.push() ;
    return e;
}
// for(let e in this.listMealConvert){
// let c:CalendarEvent;
// c.start=addHours(startOfDay(this.parseDate(e.DateOfPic)), 2);
// c.end= addHours(startOfDay(this.parseDate(e.DateOfPic)), 4);
// c.title= e.Path;
// c.color=colors.red;
// c.actions= this.actions;
// c.allDay= true;
// c.resizable= {
//   beforeStart: true,
//   afterEnd: true
// };
// c.draggable=true
  
//    this.listAllMealToCalendar.push( c);
// }

  
  

  public GetMealsForSearch(label: string) {
    const res = this.http.get<Meal[]>(this.baseURL + 'meal?label=' + label);
    return new Promise(resolve => {
      res.subscribe(data => {
        resolve(data);
      });
    });
  }

  // public GetAllMeals() {

  //   return this.http.get(this.baseURL + 'meal');

  //   // const res = this.http.get(this.baseURL + 'meal');
  //   // return new Promise(resolve => {
  //   //   res.subscribe(data => {
  //   //     resolve(data);
  //   //   });
  //   // });
  // }
  getResults(): Observable<Meal[]> {
    let observable: Observable<Meal[]>;
    if (this.listAllMealToCalendar.length === 0) {
      observable = this.http.get<Meal[]>(this.baseURL + 'meal');
    } else {
      observable = of(this.listAllMealToCalendar);
    }
    return observable;
  }
}
