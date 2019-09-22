import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { MealService } from '../Providers/meal.service';
import { Meal } from '../classes/Meal';
import { AutoCompleteLabelsService } from '../Providers/auto-complete-labels.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage {
  constructor(private route: ActivatedRoute,
              private router: Router,
              public mealService: MealService,
              public autoCompleteLabelsService: AutoCompleteLabelsService) {
    this.display = false;
    this.route.queryParams.subscribe(params => {
      if (params && params.special) {
        this.data = JSON.parse(params.special);
        this.searchText = this.data;
        this.loadLabelsFromAPI();
      }
    });
  }

  meals: Meal[] = [];
  data: any;
  myMeal: any;
  display: boolean;
  load: any;
  searchText = '';

  onSelected() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        special: JSON.stringify(this.searchText)
      }
    };
    this.searchText = '';
    this.router.navigate(['/search'], navigationExtras);
  }

  resolveAfter2Seconds() {
    return new Promise(resolve => {
      resolve(
        this.mealService.GetMealsForSearch(this.data).then((mealk: Meal[]) => {
          this.meals = mealk;
          console.log(this.meals);
          return mealk;
        }));
    });
  }
  async loadLabelsFromAPI() {
    this.meals = await this.resolveAfter2Seconds() as Meal[];
    this.display = false;
    if (this.meals.length === 0) {
      this.display = true;
    }
  }
}
