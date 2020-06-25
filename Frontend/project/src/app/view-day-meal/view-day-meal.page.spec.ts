import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDayMealPage } from './view-day-meal.page';

describe('ViewDayMealPage', () => {
  let component: ViewDayMealPage;
  let fixture: ComponentFixture<ViewDayMealPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewDayMealPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDayMealPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
