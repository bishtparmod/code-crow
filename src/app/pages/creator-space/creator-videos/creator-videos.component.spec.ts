import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatorVideosComponent } from './creator-videos.component';

describe('CreatorVideosComponent', () => {
  let component: CreatorVideosComponent;
  let fixture: ComponentFixture<CreatorVideosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatorVideosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatorVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
