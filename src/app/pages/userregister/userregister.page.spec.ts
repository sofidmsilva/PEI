import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserregisterPage } from './userregister.page';

describe('UserregisterPage', () => {
  let component: UserregisterPage;
  let fixture: ComponentFixture<UserregisterPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserregisterPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserregisterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
