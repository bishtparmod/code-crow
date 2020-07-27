import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatorVideosInsightsComponent } from './creator-videos-insights.component';

describe('CreatorVideosInsightsComponent', () => {
  let component: CreatorVideosInsightsComponent;
  let fixture: ComponentFixture<CreatorVideosInsightsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatorVideosInsightsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatorVideosInsightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
