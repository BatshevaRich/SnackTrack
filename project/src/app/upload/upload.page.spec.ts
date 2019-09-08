import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadPage } from './upload.page';

describe('UploadPage', () => {
  let component: UploadPage;
  let fixture: ComponentFixture<UploadPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
