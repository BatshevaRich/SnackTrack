
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
import { Router, NavigationExtras, NavigationEnd, NavigationStart } from '@angular/router';
import { CalendarEventActionsComponent } from 'angular-calendar/modules/common/calendar-event-actions.component';
import { PopoverController } from '@ionic/angular';
import { ViewDayMealPage } from '../view-day-meal/view-day-meal.page';
import { Storage } from '@ionic/storage';
import { Meal } from '../classes/Meal';
import { filter } from 'rxjs/operators';
import { NavigationEvent } from '@ng-bootstrap/ng-bootstrap/datepicker/datepicker-view-model';
// ,*TgpkZTbdtlA~u
const colors: any = {
  red: { primary: Image, secondary: Image },
  blue: { primary: '#1e90ff', secondary: '#D1E8FF' },
  yellow: { primary: '#e3bc08', secondary: '#FDF1BA' }
};
export interface mealLoaded {
  Path: string;
  DateOfPic: string;
  Labels: string[];
}
@Component({
  selector: 'app-home',
  // changeDetection: ChangeDetectionStrategy.OnPush,
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
    this.mealsFromServer = [];
  }
  @ViewChild('box', null) userInput;
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  modalData: { action: string; event: CalendarEvent; };

  refresh: Subject<any> = new Subject();
  events: CalendarEvent[] = [];
  didNotLoad: boolean;
  activeDayIsOpen = false;
  mealsFromServer: mealLoaded[];
  searchText = '';
  imagesToLoad: string[] = [];
  labelsToLoad: string[] = [];
  dateToLoad: string;
  currentImage: any;
  ionViewWillEnter() {
    this.storage.clear();
    this.refresh.next();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      filter((event: NavigationEnd) =>
      event.urlAfterRedirects == './options'))
      .subscribe((route: NavigationStart) => {
        this.ngOnInit();
      });
  }

  public weekViewColumnHeader({ date, locale }: DateFormatterParams): string {
    return new DatePipe(locale).transform(date, 'EEE', locale);
  }

  ngOnInit() {
    console.log('init');
    this.events = [];
    this.loadLabelsFromAPI();
    this.refresh.next();
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

  takePicture($event) {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };
    this.camera.getPicture(options).then((imageData) => {
      this.currentImage = imageData;
      // 'data:image/jpeg;base64,'
      this.storage.set('img', this.currentImage).then((response) => {

      }).catch((error) => {
        console.log('set error for ' + this.currentImage + ' ', error);
      });
      this.storage.set('img', this.currentImage);
      this.router.navigate(['/options']);
    }, (err) => {
      console.log('Camera issue:' + err);
    });
  }

  loadLabelsFromAPI() {
    this.mealService.GetAllMeals().subscribe(
      (res: mealLoaded[]) => {
        this.events = [];
        for (const m of res) {
          this.events.push({
            start: addHours(startOfDay(this.parseDate(m.DateOfPic)), 2),
            end: addHours(startOfDay(this.parseDate(m.DateOfPic)), 4),
            title: m.Path,
            color: colors.red,
            allDay: true,
            resizable: {
              beforeStart: true,
              afterEnd: true
            },
            draggable: true
          });
        }
      }
    );
    this.refresh.next();
  }

  public addEvent(): void {
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
