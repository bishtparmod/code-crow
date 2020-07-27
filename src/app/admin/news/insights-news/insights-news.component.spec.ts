import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsightsNewsComponent } from './insights-news.component';

describe('InsightsFeatureComponent', () => {
  let component: InsightsNewsComponent;
  let fixture: ComponentFixture<InsightsNewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsightsNewsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsightsNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
