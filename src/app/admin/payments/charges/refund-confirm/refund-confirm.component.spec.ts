import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefundConfirmComponent } from './refund-confirm.component';

describe('RefundConfirmComponent', () => {
  let component: RefundConfirmComponent;
  let fixture: ComponentFixture<RefundConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefundConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefundConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
