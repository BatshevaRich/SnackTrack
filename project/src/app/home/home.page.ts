import { CalendarComponent } from 'ionic2-calendar/calendar';
import { Component, ViewChild, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { AlertController, Events } from '@ionic/angular';
import { formatDate } from '@angular/common';
import { Variable } from '@angular/compiler/src/render3/r3_ast';
import { NavController, NavParams } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';
import { Meal } from '../classes/Meal';
import { CalendarService } from '../Providers/calendar.service';
import {DayMeal} from '../classes/DayMeal';
import { MealService } from '../Providers/meal.service';
import { NgZone } from '@angular/core';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit {
  // @ViewChild(CalendarComponent) myCal: CalendarComponent;
  event = {
    path: '',
    startTime: '',
    endTime: '',
    cat:['','','','']
  };
  minDate = new Date().toISOString();

  // all meals returned from server
  eventSource =[];
  viewTitle;

  calendar = {
    mode: 'month',
    currentDate: new Date(),
  };
allMeal=[];
  flag = 0;
  constructor(public e:Events, private zone:NgZone, private alertCtrl: AlertController, @Inject(LOCALE_ID) private locale: string, private router: Router, private calendarS: CalendarService, private mealS: MealService) {
    this.retrieveAllMeal();
this.e.subscribe('updateScreen',()=>{this.zone.run(()=>{console.log('cd');});});  }

  resolveAfter2Seconds(date: Date) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(
          // send the local storage base64 path
          this.calendarS.LoadFoodsFromServerForDay(date).then(data => {
            console.log(data);
            this.eventSource = [];
            this.eventSource = data as Array<DayMeal>;
          })
        );
      }, 400);
    });
  }
  converaMeal(){
    for(let i=0;i<this.allMeal.length;i++){
      this.addMealToEventSource(this.allMeal[i]);
    }
  }
  addMealToEventSource(eve){
    let eventCopy = {
      path: eve.Path,
      startTime:new Date(eve.DateOfPic),
      endTime: new Date(eve.DateOfPic),
      cat:eve.Labels
    }
    this.eventSource.push(eventCopy);
  }

  /**
   * asynchronous func to load labels from webapi
   * marks as true only 5, all the rest are marked as false
   * called on page load
   */
  async loadLabelsFromAPI(date: Date) {
    await this.resolveAfter2Seconds(date);

  }
  retrieveAllMeal(){
    // this.allMeal=[];
    this.mealS.GetAllMeals().subscribe(ss=>
      {this.allMeal=ss;
       }
        ,err=>{console.log(err);});
  }
  async s() {
    await this.retrieveAllMeal();
  }
  ngOnInit() {


  }
  ionViewWillEnter(){
     this.converaMeal();
  }

  resetEvent() {
    this.event = {
        path: '',
        startTime: '',
        endTime: '',
        cat:['','','','']
    };
  }

  // Create the right event format and reload source
  // addEvent(); {
  //   const eventCopy = {
  //     title: this.event.title,
  //     startTime:  new Date(this.event.startTime),
  //     endTime: new Date(this.event.endTime),
  //     allDay: this.event.allDay,
  //     desc: this.event.desc
  //   };

  //   if (eventCopy.allDay) {
  //     const start = eventCopy.startTime;
  //     const end = eventCopy.endTime;

  //     eventCopy.startTime = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate()));
  //     eventCopy.endTime = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate() + 1));
  //   }
  // // send eventCopy to api????????????????? opens the take picture page.... or something else?????

  //   // this.eventSource.push(eventCopy);
  //   // this.myCal.loadEvents();
  //   this.resetEvent();
  // }
  next() {
    const swiper = document.querySelector('.swiper-container')['swiper'];
    swiper.slideNext();
  }

  back() {
    const swiper = document.querySelector('.swiper-container')['swiper'];
    swiper.slidePrev();
  }

  // Change between month/week/day
  changeMode(mode) {
    this.calendar.mode = mode.detail.value;
  }

  // Focus today
  today() {
    this.calendar.currentDate = new Date();
  }

  // Selected date reange and hence title changed
  onViewTitleChanged(title) {
    this.viewTitle = title;
  }

  // Calendar event was clicked
  async onEventSelected(event) {
    // Use Angular date pipe for conversion
    let start = formatDate(event.startTime, 'medium', this.locale);
    let end = formatDate(event.endTime, 'medium', this.locale);
    let i=0;
    let s='';
   for(i=0;i<event.cat.length;i++)
    s=s+event.cat[i]+','+' ';
    const alert = await this.alertCtrl.create({
      header: event.path,
      message: 'From: ' + start + '<br><br>To: ' + end+ '<br><br>To: '+ s,
      buttons: ['OK']
    });
    alert.present();
  }


  ionChange(event) {
    // console.log(event.currentTarget);
    const navigationExtras: NavigationExtras = {
      queryParams: {
        special: JSON.stringify(event.target.value)
        // special: JSON.stringify(event.currentTarget.attributes[3].textContent)
      }
    };
    event.target.value = '';
    this.router.navigate(['search'], navigationExtras);
  }
eventDemo:any;
  // Time slot was clicked
  onTimeSelected(event) {

    const selected = new Date(event.selectedTime);
    this.event.startTime = selected.toISOString();
    selected.setHours(selected.getHours() + 1);
    this.event.endTime = (selected.toISOString());
    // this.loadLabelsFromAPI(selected);
    
    // send event....
    //
  }
}
