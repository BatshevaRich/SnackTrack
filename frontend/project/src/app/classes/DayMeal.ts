export class DayMeal {
    path: string;
    categories: string[];
    hourS: string;
    hourE: string;
    constructor(path: string, hourS: string, hourE: string, categories: string[]) {
      this.hourS = hourS;
      this.hourE = hourE;
      this.path = path;
      this.categories = categories;
    }
  }