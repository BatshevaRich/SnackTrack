import { Component, OnInit } from '@angular/core';
import { PopoverController, NavParams} from '@ionic/angular';
import{ Meal }from '../classes/Meal';
import{MealService}from '../Providers/meal.service'
import { from } from 'rxjs';

@Component({
  selector: 'app-view-day-meal',
  templateUrl: './view-day-meal.page.html',
  styleUrls: ['./view-day-meal.page.scss'],
})
export class ViewDayMealPage implements OnInit{
  
  today:Date;
mealsToday:Meal[];
  constructor(public navParams:NavParams,public popoverCtrl: PopoverController,public mealService:MealService) {
    this.mealsToday = [];
      }

      ngOnInit() {
          this.today=this.navParams.get("dateToday");
          new Promise(resolve => {
            resolve(
              // send the local storage base64 path
              this.mealService.GetTodayMeals(this.today).then(data => {
                // console.log(data);
                this.mealsToday = [];
                this.mealsToday = data as Meal[];
                // console.log(this.mealsToday);
                // this.didNotLoad = false;
                // this.userInput.onClick();
              })
            );
          });
          
      }
  close() {
    this.popoverCtrl.dismiss();

  }

  
}
