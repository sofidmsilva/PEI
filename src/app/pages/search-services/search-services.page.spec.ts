import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchServicesPage } from './search-services.page';

describe('SearchServicesPage', () => {
  let component: SearchServicesPage;
  let fixture: ComponentFixture<SearchServicesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchServicesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchServicesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
