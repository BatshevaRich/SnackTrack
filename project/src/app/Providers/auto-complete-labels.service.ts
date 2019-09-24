import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { AutoCompleteService } from 'ionic4-auto-complete';
import { Label } from '../classes/Label';

@Injectable({
  providedIn: 'root'
})
export class AutoCompleteLabelsService implements AutoCompleteService {
  labelAttribute = 'name';
  private labels: any[] = [];
  baseURL = 'http://34.90.143.154/api/';

  constructor(private http: HttpClient) {
    this.initialization();
  }

  initialization() {
    this.http.get<string[]>(this.baseURL + 'label').subscribe(allLabel => {
      this.labels = allLabel;
    },
      err => { console.log(err); }
    );
  }
  public addLabels(labels: string[]) {
    for (const i in labels) {
      this.labels.push(i);
    }
  }
  getResults(keyword: string): Observable<any[]> {
    let observable: Observable<any>;
    if (this.labels.length === 0) {
      observable = this.http.get(this.baseURL + 'label');
    } else {
      observable = of(this.labels);
    }
    return observable.pipe(
      map((result) => {
        return result.filter((item) => {
          return item.toLowerCase().indexOf(keyword.toLowerCase()) > -1;
        });
      }
      ));
  }
}
