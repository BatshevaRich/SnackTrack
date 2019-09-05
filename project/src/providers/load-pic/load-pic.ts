import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Label } from '../../app/classes/Label';
import { ApiPictureProvider } from '../api-picture/api-picture';

/*
  Generated class for the LoadPicProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LoadPicProvider {
  loadedLabels: Label[];

  labels: Array<{ name: string; probability: number; wanted: boolean }>;
  tags: Label[];
  constructor(public http: HttpClient, public apPic: ApiPictureProvider) {
    console.log('Hello LoadPicProvider Provider');
    console.log('hool');
    this.labels = new Array<{
      name: string;
      probability: number;
      wanted: boolean;
    }>();
    // this.f1('');
  }
  baseURL = "http://localhost:54640/api/";
  public GetLabelForPicture(){
    // this.apPic.GetLabels('');
    // this.f1();
    return this.labels;
  }

  resolveAfter2Seconds(path: string) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(
          this.apPic.GetLabels().then(data => {
            this.tags = data as Label[];
            console.log(this.tags);
          })
        );
      }, 4000);
    });
  }

  async f1(path: string) {
    var x = await this.resolveAfter2Seconds(path);
    this.loadedLabels = this.tags as Label[];
    let i = 0;
    for (; i < this.tags.length; i++) {
      this.labels.push({
        name: this.loadedLabels[i].Name,
        probability: this.loadedLabels[i].Probability,
        wanted: true
      });
    }
    
  }
  
}
