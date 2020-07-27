import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BriefAnalyticsComponent } from './brief-analytics.component';

describe('BriefAnalyticsComponent', () => {
  let component: BriefAnalyticsComponent;
  let fixture: ComponentFixture<BriefAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BriefAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BriefAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
