import { Component, OnInit } from '@angular/core';
import { PopoverController, NavParams, ModalController } from '@ionic/angular';
import { Meal } from '../classes/Meal';
import { MealService } from '../Providers/meal.service';
import { from } from 'rxjs';
import { Storage } from '@ionic/storage';
import { ZoomImagePage } from '../Zoom-image/Zoom-image.page';
import { HttpParams } from '@angular/common/http';
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
    public modalCtrl: ModalController,
    private storage: Storage) {
    this.mealsToday = [];
  }
  userName: string;
  userPass: string;
  ngOnInit() {
    this.today = this.navParams.get('dateToday');
    new Promise(resolve => {
      resolve(
        this.storage.get('auth-token').then(res => {
          const user = res as string;
          const user1: string = user;
          this.userName = user.substring(0, user.indexOf(','));
          this.userPass = user.substring(user.indexOf(',') + 1, user.length);
          let param = new HttpParams();
          param = param.append('year', this.today.getFullYear().toString());
          param = param.append('month', (this.today.getMonth() + 1).toString());
          param = param.append('day', this.today.getDate().toString());
          param = param.append('user', user1);
          param = param.append('name', this.userName);
          param = param.append('pass', this.userPass);
          console.log(res);
          this.mealS.GetTodayMeals(param).then(data => {
            this.mealsToday = [];
            this.mealsToday = data as Meal[];
          });
        }));
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
