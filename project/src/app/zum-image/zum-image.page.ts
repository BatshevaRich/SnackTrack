import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController} from '@ionic/angular';
import{ Meal }from '../classes/Meal';
import{MealService}from '../Providers/meal.service'
import { from } from 'rxjs';


@Component({
  selector: 'app-zum-image',
  templateUrl: './zum-image.page.html',
  styleUrls: ['./zum-image.page.scss'],
})
export class zumImagePage implements OnInit {
srcImage:string;
  constructor(public navParams:NavParams,public PopoverCtrl: PopoverController) { }

  ngOnInit() {
    this.srcImage=this.navParams.get('img');
  }
  close() {
    this.PopoverCtrl.dismiss();
  } 
}