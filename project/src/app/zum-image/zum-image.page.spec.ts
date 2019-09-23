import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZumImagePage } from './zum-image.page';

describe('ZumImagePage', () => {
  let component: ZumImagePage;
  let fixture: ComponentFixture<ZumImagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZumImagePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZumImagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
