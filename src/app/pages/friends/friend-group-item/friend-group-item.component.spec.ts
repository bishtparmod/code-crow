import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendGroupItemComponent } from './friend-group-item.component';

describe('FriendGroupItemComponent', () => {
  let component: FriendGroupItemComponent;
  let fixture: ComponentFixture<FriendGroupItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FriendGroupItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FriendGroupItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
