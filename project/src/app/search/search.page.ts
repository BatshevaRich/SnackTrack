import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MealService } from '../Providers/meal.service';
import { Meal } from '../classes/Meal';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  meals: Meal[];
  data: any;
  myMeal: any;

  load: any;
  ngOnInit() {
  }
  constructor(private route: ActivatedRoute, private router: Router, public mealService: MealService) {
    this.route.queryParams.subscribe(params => {
      if (params && params.special) {
        this.data = JSON.parse(params.special);
        console.log(params);
        this.mealService.GetMealsForSearch(this.data).then((mealk: Meal[]) => {
        this.meals = mealk;
      });
    }
  });
}




  // resolveAfter2Seconds() {
  //   return new Promise(resolve => {
  //     setTimeout(() => {
  //       resolve(
  //         this.meals.GetMealsForSearch("beet").then(data => {
  //           this.myMeal = data;
  //           console.log(this.meals.length);
  //         })
  //       );
  //     }, 400);
  //   });
  // }

  // async loadMealsFromDB() {
  //   await this.resolveAfter2Seconds();
  //   this.meals = this.myMeal as Meal[];}
  // }

}
