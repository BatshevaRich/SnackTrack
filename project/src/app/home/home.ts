import { IonicPage, NavController, NavParams } from "ionic-angular";
import { CalendarComponent } from "ionic2-calendar/calendar";
import { Component, ViewChild, OnInit, Inject, LOCALE_ID } from "@angular/core";
import { AlertController } from "ionic-angular";
// import { formatDate } from "@angular/common";
// import { Variable } from '@angular/compiler/src/render3/r3_ast';
import { Router, NavigationExtras } from "@angular/router";
import { Meal } from "../../app/classes/Meal";
/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage implements OnInit {
  event = {
    title: "",
    desc: "",
    startTime: "",
    endTime: "",
    allDay: false
  };

  minDate = new Date().toISOString();

  eventSource: Meal[];
  viewTitle;

  calendar = {
    mode: "month",
    currentDate: new Date()
  };

  // @ViewChild(CalendarComponent) myCal: CalendarComponent;

  constructor(
    private alertCtrl: AlertController,
    @Inject(LOCALE_ID) private locale: string,
    private router: Router
  ) {}

  ngOnInit() {
    this.resetEvent();
    let eventCopy = {
      title: "this.event.title",
      startTime: new Date(),
      endTime: new Date(),
      path: "this.event.path",
      desc: "this.event.desc"
    };
    //send eventCopy to api
    //this.eventSource.push(eventCopy);
  }

  resetEvent() {
    this.event = {
      title: "",
      desc: "",
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      allDay: false
    };
  }

  // Create the right event format and reload source
  addEvent() {
    let eventCopy = {
      title: this.event.title,
      startTime: new Date(this.event.startTime),
      endTime: new Date(this.event.endTime),
      allDay: this.event.allDay,
      desc: this.event.desc
    };

    if (eventCopy.allDay) {
      let start = eventCopy.startTime;
      let end = eventCopy.endTime;

      eventCopy.startTime = new Date(
        Date.UTC(
          start.getUTCFullYear(),
          start.getUTCMonth(),
          start.getUTCDate()
        )
      );
      eventCopy.endTime = new Date(
        Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate() + 1)
      );
    }
    //send eventCopy to api

    //this.eventSource.push(eventCopy);
    // this.myCal.loadEvents();
    this.resetEvent();
  }
  next() {
    var swiper = document.querySelector(".swiper-container")["swiper"];
    swiper.slideNext();
  }

  back() {
    var swiper = document.querySelector(".swiper-container")["swiper"];
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
    // let start = formatDate(event.startTime, "medium", this.locale);
    // let end = formatDate(event.endTime, "medium", this.locale);

    // const alert = await this.alertCtrl.create({
    //   header: event.title,
    //   subHeader: event.desc,
    //   message: "From: " + start + "<br><br>To: " + end,
    //   buttons: ["OK"]
    // });
    // alert.present();
  }

  ionChange(event) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        special: JSON.stringify(event.currentTarget.attributes[3].textContent)
      }
    };
    event.target.value = "";
    this.router.navigate(["serch"], navigationExtras);
  }

  flag = 0;

  // Time slot was clicked
  onTimeSelected(event) {
    let selected = new Date(event.selectedTime);
    this.event.startTime = selected.toISOString();
    selected.setHours(selected.getHours() + 1);
    this.event.endTime = selected.toISOString();
  }
}
