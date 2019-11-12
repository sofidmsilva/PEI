import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllTabsPage } from './all-tabs.page';

describe('AllTabsPage', () => {
  let component: AllTabsPage;
  let fixture: ComponentFixture<AllTabsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllTabsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllTabsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
