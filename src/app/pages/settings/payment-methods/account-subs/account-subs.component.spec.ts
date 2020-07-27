import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountSubsComponent } from './account-subs.component';

describe('AccountSubsComponent', () => {
  let component: AccountSubsComponent;
  let fixture: ComponentFixture<AccountSubsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountSubsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountSubsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
