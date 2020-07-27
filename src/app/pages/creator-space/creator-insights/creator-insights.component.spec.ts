import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatorInsightsComponent } from './creator-insights.component';

describe('CreatorInsightsComponent', () => {
  let component: CreatorInsightsComponent;
  let fixture: ComponentFixture<CreatorInsightsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatorInsightsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatorInsightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
