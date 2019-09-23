import { Component, OnInit } from '@angular/core';
import { PopoverController, NavParams, ModalController} from '@ionic/angular';
import{ Meal }from '../classes/Meal';
import{MealService}from '../Providers/meal.service'
import { from } from 'rxjs';
import{zumImagePage}from'../zum-image/zum-image.page'
@Component({
  selector: 'app-view-day-meal',
  templateUrl: './view-day-meal.page.html',
  styleUrls: ['./view-day-meal.page.scss'],
})
export class ViewDayMealPage implements OnInit{
  
  today:Date;
mealsToday:Meal[];
  constructor(public navParams:NavParams,public popoverCtrl: PopoverController,
    public mealService:MealService, public modalCtrl:ModalController) {
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
  async zum(datet:string){
    const popover =await this.popoverCtrl.create({
component:zumImagePage,
componentProps:{
  img:datet
}
    });
    popover.style.cssText = '--max-height:95%;--width:90%';
    popover.present();
  }

  
}
