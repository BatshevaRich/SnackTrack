import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {AutoCompleteService} from 'ionic4-auto-complete';
import { Label } from '../classes/Label';

@Injectable({
  providedIn: 'root'
})
export class AutoCompleteLabelsService implements AutoCompleteService {
  labelAttribute = 'name';
  private labels: string[] = [];
 private baseURL ='http://localhost:54640/api/'

  constructor(private http: HttpClient) { 
      this.initialization();
  }

  initialization(){
    this.http.get<string[]>(this.baseURL + 'Labels').subscribe(allLabel=>
      { 
        this.labels=allLabel;
      } ,
      err=>{console.log(err);}
     );
  }
  getResults(keyword: string):
   string[]{
  return this.labels.filter((label)=>{
    return label.toLowerCase().indexOf( keyword.toLowerCase()) > -1;
      });
    }
  }
