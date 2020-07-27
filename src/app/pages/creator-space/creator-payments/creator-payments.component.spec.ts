import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatorPaymentsComponent } from './creator-payments.component';

describe('CreatorPaymentsComponent', () => {
  let component: CreatorPaymentsComponent;
  let fixture: ComponentFixture<CreatorPaymentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatorPaymentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatorPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
