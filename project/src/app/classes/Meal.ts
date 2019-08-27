export class Meal {
path:string
hour:Date
categories:string[]
    constructor(path:string,hour:Date,categories:string[]) {
        this.path=path;
        this.hour=hour;
        this.categories=categories;//pass on the array to fill
    }
  
    ionViewDidLoad() {
      console.log('ionViewDidLoad DayPage');
    }
  
  }
  