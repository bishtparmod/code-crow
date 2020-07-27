import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminVideoStatisticsComponent } from './admin-video-statistics.component';

describe('AdminVideoStatisticsComponent', () => {
  let component: AdminVideoStatisticsComponent;
  let fixture: ComponentFixture<AdminVideoStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminVideoStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminVideoStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
