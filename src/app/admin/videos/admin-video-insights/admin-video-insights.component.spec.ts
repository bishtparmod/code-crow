import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminVideoInsightsComponent } from './admin-video-insights.component';

describe('AdminVideoInsightsComponent', () => {
  let component: AdminVideoInsightsComponent;
  let fixture: ComponentFixture<AdminVideoInsightsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminVideoInsightsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminVideoInsightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
