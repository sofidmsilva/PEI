import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewAdminPage } from './overview-admin.page';

describe('OverviewAdminPage', () => {
  let component: OverviewAdminPage;
  let fixture: ComponentFixture<OverviewAdminPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverviewAdminPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverviewAdminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
