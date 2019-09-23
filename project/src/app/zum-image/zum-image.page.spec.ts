import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { zumImagePage } from './zum-image.page';

describe('zumImagePage', () => {
  let component: zumImagePage;
  let fixture: ComponentFixture<zumImagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ zumImagePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(zumImagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
