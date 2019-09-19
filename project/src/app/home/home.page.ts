
import { Component, ChangeDetectionStrategy, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';
import { CalendarDateFormatter, DateFormatterParams } from 'angular-calendar';
import { DatePipe } from '@angular/common';
import { Title } from '@angular/platform-browser';

import { AutoCompleteLabelsService } from '../Providers/auto-complete-labels.service';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView, CalendarEvent } from 'angular-calendar';
import { MealService } from '../Providers/meal.service';
import { Router, NavigationExtras } from '@angular/router';
import { CalendarEventActionsComponent } from 'angular-calendar/modules/common/calendar-event-actions.component';
import { PopoverController } from '@ionic/angular';
import { ViewDayMealPage } from '../view-day-meal/view-day-meal.page';
import { Storage } from '@ionic/storage';
import { Meal } from '../classes/Meal';

const colors: any = {
  red: { primary: Image, secondary: Image },
  blue: { primary: '#1e90ff', secondary: '#D1E8FF' },
  yellow: { primary: '#e3bc08', secondary: '#FDF1BA' }
};
interface mealLoaded {
  Path: string;
  DateOfPic: string;
  Labels: string[];
}
@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  constructor(private camera: Camera,
    private storage: Storage, private titleService: Title,
    private router: Router,
    private modal: NgbModal,
    private mealService: MealService,
    public autoCompleteLabelsService: AutoCompleteLabelsService,
    public popoverCtrl: PopoverController) {
    this.loadLabelsFromAPI();
    this.mealsFromServer = [];
    this.didNotLoad = true;
    // await this.loadLabelsFromAPI();
    this.mealsFromServer = [];

    // this.dayClicked();    
  }
  ionViewWillEnter() {
    this.storage.clear();
  }
  someMethod() {
    this.titleService.setTitle('An Awesome Title');
  }


  public weekViewColumnHeader({ date, locale }: DateFormatterParams): string {
    return new DatePipe(locale).transform(date, 'EEE', locale);
  }
  @ViewChild('box', null) userInput;
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  modalData: { action: string; event: CalendarEvent; };
  actions: CalendarEventAction[] = [
    {
      label: '<i></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
        this.handleEvent('Deleted', event);
      }
    }
  ];
  refresh: Subject<any> = new Subject();
  events: CalendarEvent[] = [];
  didNotLoad: boolean;
  activeDayIsOpen = false;
  mealsFromServer: mealLoaded[];
  searchText = '';
  imagesToLoad: string[] = [];
  labelsToLoad: string[] = [];
  dateToLoad: string;
  async ngOnInit() {
    this.loadLabelsFromAPI();
    // location.reload();
  }

  parseDate(value): Date {
    if (value.indexOf('-') > -1) {
      const str = value.split('-');
      const year = Number(str[0]);
      const month = Number(str[1]) - 1;
      const s = str[2].split('T');
      const time = s[1];
      const date = Number(s[0]);
      return new Date(year, month, date);
    }
    return new Date();
  }
  parseTime(value): number {
    if (value.indexOf('-') > -1) {
      const str = value.split('T');
      const time = str[1];
      const h = time.split(':');
      return Number(h[0]);
    }
  }
  currentImage: any;


  // takePicture($event) {
  //   const options: CameraOptions = {
  //     quality: 100,
  //     destinationType: this.camera.DestinationType.DATA_URL,
  //     encodingType: this.camera.EncodingType.JPEG,
  //     mediaType: this.camera.MediaType.PICTURE
  //   };

  //   this.camera.getPicture(options).then((imageData) => {
  //     this.currentImage = 'data:image/jpeg;base64,' + imageData;
  //     alert(imageData);
  //     this.sendImage($event);
  //   // this.router.navigate(['/camera']);
  //   }, (err) => {
  //     // Handle error
  //     console.log('Camera issue:' + err);
  //   });
  // }






  takePicture($event) {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options).then((imageData) => {
      this.currentImage = 'data:image/jpeg;base64,' + imageData;
   
      this.storage.set("img", this.currentImage ).then((response) => { 

      }).catch((error) => {

        console.log('set error for ' + this.currentImage + ' ', error);
      });
      this.storage.set("img",this.currentImage );
    this.router.navigate(['/options']);
    }, (err) => {
      // Handle error
      console.log('Camera issue:' + err);
    });
  }
  
 
















  convertMealsToEvent() {
    this.mealsFromServer = this.mealsFromServer as [];
    for (let index = 0; index < this.mealsFromServer.length; index++) {
      // alert(this.mealsFromServer[0].DateOfPic);
      colors.red.primary = new Image();
      colors.red.primary.src = this.mealsFromServer[index].Path;
      colors.red.secondary = new Image();
      colors.red.secondary.src = this.mealsFromServer[index].Path;
      const endate = new Date(this.parseDate(this.mealsFromServer[index].DateOfPic));
      let s = '';
      let i;
      for (i = 0; i < this.mealsFromServer[index].Labels.length - 1; i++) {
        s = s + this.mealsFromServer[index].Labels[i] + ', ';
      }
      s = s + this.mealsFromServer[index].Labels[i];
      this.events.push({
        start: addHours(startOfDay(this.parseDate(this.mealsFromServer[index].DateOfPic)), 2),
        end: addHours(startOfDay(this.parseDate(this.mealsFromServer[index].DateOfPic)), 4),
        title: s,
        color: colors.red,
        actions: this.actions,
        allDay: true,
        resizable: {
          beforeStart: true,
          afterEnd: true
        },
        draggable: true
      },
      );
    }
  }
  resolveAfter2Seconds() {
    return new Promise(resolve => {
        resolve(
          // send the local storage base64 path
          this.mealService.GetAllMeals().then(data => {
            console.log(data);
            this.mealsFromServer = [];
            this.mealsFromServer = data as [];
            this.convertMealsToEvent();
            this.didNotLoad = false;
            // this.userInput.onClick();
          })
        );
    });
  }
  async loadLabelsFromAPI() {
    this.resolveAfter2Seconds();
    console.log(this.mealsFromServer);
    return this.mealsFromServer;
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map(iEvent => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors.red,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true
        }
      }
    ];
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter(event => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
  onSelected() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        special: JSON.stringify(this.searchText)
      }
    };
    this.searchText = '';
    this.router.navigate(['/search'], navigationExtras);
  }
  setValue(key: string, value: any) {
    // this.storage.remove("key");
    this.storage.set(key, value).then((response) => {
    }).catch((error) => {
      console.log('set error for ' + key + ' ', error);
    });
    this.storage.set(key, value);
  }

  sendImage($event): void {
    const file: File = $event.target.files[0];
    const reader = new FileReader();
    this.storage.clear();
    reader.onload = (event: any) => {
      this.setValue('img', event.target.result);
      this.router.navigate(['/options']);
    };
    reader.readAsDataURL(file);
    // this.router.navigate(['/options']);
    // this.navCtrl.navigateRoot("/options"); // go to next page
  }
  ss() {
    alert("today");
  }

  async presentPopover({ date, events }: { date: Date; events: CalendarEvent[] }) {
    const popover = await this.popoverCtrl.create({
      component: ViewDayMealPage,
      componentProps: {
        dateToday: date
      },
    });
    popover.style.cssText = '--max-height:45%;--width:95%';
    popover.present();
  }
}
