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

  meals: Meal[] = [];
  data: any;
  myMeal: any;
display: boolean;
  load: any;
  ionViewDidLoad() {

  }

   searchText = '';

  onSelected() {
    // console.log(event.currentTarget);
    const navigationExtras: NavigationExtras = {
      queryParams: {
        special: JSON.stringify(this.searchText)
        // special: JSON.stringify(event.currentTarget.attributes[3].textContent)
      }
    };
    this.searchText = '';
    this.router.navigate(['/search'], navigationExtras);
  }
  constructor(private route: ActivatedRoute, private router: Router, public mealService: MealService
    ,public autoCompleteLabelsService: AutoCompleteLabelsService) {
     
    this.display = false;
    alert(this.display);

    console.log(this.meals);
    this.route.queryParams.subscribe(params => {
        if (params && params.special) {
          this.data = JSON.parse(params.special);
this.searchText=this.data;
          this.loadLabelsFromAPI();
          };
        });
      

     
  }

  resolveAfter2Seconds() {
    return new Promise(resolve => {
      // setTimeout(() => {
        resolve(
          // send the local storage base64 path
          this.mealService.GetMealsForSearch(this.data).then((mealk: Meal[]) => {
            this.meals = mealk;
            console.log(this.meals);
            return mealk;
      // }, 400);
    }));
  })}
  async loadLabelsFromAPI() {
    this.meals = await this.resolveAfter2Seconds() as Meal[];
    alert(this.meals);
    if (this.meals.length == 0) {
      this.display=true;
    }
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
