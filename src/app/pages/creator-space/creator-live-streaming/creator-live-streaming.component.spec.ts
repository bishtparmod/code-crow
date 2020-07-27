import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatorLiveStreamingComponent } from './creator-live-streaming.component';

describe('CreatorLiveStreamingComponent', () => {
  let component: CreatorLiveStreamingComponent;
  let fixture: ComponentFixture<CreatorLiveStreamingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatorLiveStreamingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatorLiveStreamingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
