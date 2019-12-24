import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceFiltersPage } from './service-filters.page';

describe('UserregisterPage', () => {
  let component: ServiceFiltersPage;
  let fixture: ComponentFixture<ServiceFiltersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceFiltersPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceFiltersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
