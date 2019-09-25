import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoomImagePage } from './Zoom-image.page';

describe('ZoomImagePage', () => {
  let component: ZoomImagePage;
  let fixture: ComponentFixture<ZoomImagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZoomImagePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZoomImagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
