import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoPartItemComponent } from './video-part-item.component';

describe('VideoPartItemComponent', () => {
  let component: VideoPartItemComponent;
  let fixture: ComponentFixture<VideoPartItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoPartItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoPartItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
