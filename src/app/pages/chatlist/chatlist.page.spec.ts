import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatListPage } from './chatlist.page';

describe('ChatListPage', () => {
  let component: ChatListPage;
  let fixture: ComponentFixture<ChatListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
