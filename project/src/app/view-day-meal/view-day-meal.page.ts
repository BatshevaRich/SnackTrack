import { Component, OnInit } from '@angular/core';
import { PopoverController, NavParams, ModalController } from '@ionic/angular';
import { Meal } from '../classes/Meal';
import { MealService } from '../Providers/meal.service';
import { from } from 'rxjs';
import { ZoomImagePage } from '../Zoom-image/Zoom-image.page';
@Component({
  selector: 'app-view-day-meal',
  templateUrl: './view-day-meal.page.html',
  styleUrls: ['./view-day-meal.page.scss'],
})
export class ViewDayMealPage implements OnInit {

  today: Date;
  mealsToday: Meal[];
  constructor(public navParams: NavParams,
              public popoverCtrl: PopoverController,
              public mealS: MealService,
              public modalCtrl: ModalController) {
    this.mealsToday = [];
  }

  ngOnInit() {
    this.today = this.navParams.get('dateToday');
    new Promise(resolve => {
      resolve(
        this.mealS.GetTodayMeals(this.today).then(data => {
          this.mealsToday = [];
          this.mealsToday = data as Meal[];
        })
      );
    });

  }
  close() {
    this.popoverCtrl.dismiss();

  }
  async Zoom(datet: string) {
    const popover = await this.popoverCtrl.create({
      component: ZoomImagePage,
      componentProps: {
        img: datet
      }
    });
    popover.style.cssText = '--max-height:95%;--width:90%';
    popover.present();
  }


}
