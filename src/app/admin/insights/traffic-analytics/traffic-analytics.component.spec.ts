import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrafficAnalyticsComponent } from './traffic-analytics.component';

describe('TrafficAnalyticsComponent', () => {
  let component: TrafficAnalyticsComponent;
  let fixture: ComponentFixture<TrafficAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrafficAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrafficAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
