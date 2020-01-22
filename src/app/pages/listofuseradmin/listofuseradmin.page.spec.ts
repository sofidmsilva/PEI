import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListofuseradminPage } from './listofuseradmin.page';

describe('ListofuseradminPage', () => {
  let component: ListofuseradminPage;
  let fixture: ComponentFixture<ListofuseradminPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListofuseradminPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListofuseradminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
