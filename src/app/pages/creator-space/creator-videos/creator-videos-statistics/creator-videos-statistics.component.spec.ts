import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatorVideosStatisticsComponent } from './creator-videos-statistics.component';

describe('CreatorVideosStatisticsComponent', () => {
  let component: CreatorVideosStatisticsComponent;
  let fixture: ComponentFixture<CreatorVideosStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatorVideosStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatorVideosStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
