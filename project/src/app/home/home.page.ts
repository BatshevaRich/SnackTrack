
import { Component, ChangeDetectionStrategy, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours } from 'date-fns';
import { CalendarDateFormatter, DateFormatterParams } from 'angular-calendar';
import { DatePipe } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { AutoCompleteLabelsService } from '../Providers/auto-complete-labels.service';
import { Subject, Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView, CalendarEvent } from 'angular-calendar';
import { MealService } from '../Providers/meal.service';
import { Router, NavigationExtras, NavigationEnd, NavigationStart } from '@angular/router';
import { CalendarEventActionsComponent } from 'angular-calendar/modules/common/calendar-event-actions.component';
import { PopoverController } from '@ionic/angular';
import { ViewDayMealPage } from '../view-day-meal/view-day-meal.page';
import { Storage } from '@ionic/storage';
import { Meal } from '../classes/Meal';
import { filter, map } from 'rxjs/operators';
import { NavigationEvent } from '@ng-bootstrap/ng-bootstrap/datepicker/datepicker-view-model';
import { ActivatedRoute } from '@angular/router';
import { HttpParams } from '@angular/common/http';
// ,*TgpkZTbdtlA~u
const colors: any = {
  red: { primary: Image, secondary: Image },
  blue: { primary: '#1e90ff', secondary: '#D1E8FF' },
  yellow: { primary: '#e3bc08', secondary: '#FDF1BA' }
};
export interface MealLoaded {
  Path: string;
  DateOfPic: string;
  Labels: string[];
}
@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.Default,
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
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
  mealsFromServer: MealLoaded[];
  searchText = '';
  imagesToLoad: string[] = [];
  labelsToLoad: string[] = [];
  dateToLoad: string;
  currentImage: any;
  navigationSubscription;
  userName: string;
  userPass: string;
  updated: boolean;
  events$: Observable<Array<CalendarEvent<MealLoaded>>>;
  constructor(private camera: Camera,
              private route: ActivatedRoute,
              private storage: Storage, private titleService: Title,
              private router: Router,
              private modal: NgbModal,
              private mealS: MealService,
              public autoCompleteLabelsService: AutoCompleteLabelsService,
              public popoverCtrl: PopoverController) {
                this.route.queryParams.subscribe(params => {
                  if (params && params.special) {
                    this.updated = JSON.parse(params.special);
                    this.loadLabelsFromAPI();
                  }
                });
               }

  ionViewDidEnter() {
    console.log('did');
    this.events = [];
    this.loadLabelsFromAPI();
    // this.mealsFromServer = [];
    // this.didNotLoad = true;
    this.refresh.next();
  }

  public weekViewColumnHeader({ date, locale }: DateFormatterParams): string {
    return new DatePipe(locale).transform(date, 'EEE', locale);
  }

  ngOnInit() { }
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
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: false,
      allowEdit: false,
      sourceType: 1
    };
    this.camera.getPicture(options).then((imageData) => {
      this.currentImage = imageData;
      this.storage.set('img', 'data:image/jpeg;base64,' + this.currentImage).then((response) => {
        this.router.navigate(['/options']);
      }).catch((error) => {
        console.log('set error for ' + this.currentImage + ' ', error);
      });
    }, (err) => {
      console.log('Camera issue:' + err);
    });
  }
  loadLabelsFromAPI() {
    this.storage.get('auth-token').then(res => {
      const user = res as string;
      const user1: string = user;
      this.userName = user.substring(0, user.indexOf(','));
      this.userPass = user.substring(user.indexOf(',') + 1, user.length);
      let params = new HttpParams();
      params = params.append('user', user1);
      params = params.append('name', this.userName);
      params = params.append('pass', this.userPass);
      this.events$ = this.mealS.GetAllMeals(params).pipe(map((results: MealLoaded[]) => {
        return results.map((res: MealLoaded) => {
          this.refresh.next();
          return {
            start: addHours(startOfDay(this.parseDate(res.DateOfPic)), 2),
            end: addHours(startOfDay(this.parseDate(res.DateOfPic)), 4),
            title: res.Path,
          };
        });
      }));
    });

    // return this.mealS.GetAllMeals().subscribe((data: Response) => { });
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
    reader.onload = (event: any) => {
      this.setValue('img', event.target.result);
      this.router.navigate(['/options']);
    };
    reader.readAsDataURL(file);
  }

  async presentPopover({ date, events }: { date: Date; events: CalendarEvent[] }) {
    this.autoCompleteLabelsService.initialization();
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
