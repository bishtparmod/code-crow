import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatorVideosViewersComponent } from './creator-videos-viewers.component';

describe('CreatorVideosViewersComponent', () => {
  let component: CreatorVideosViewersComponent;
  let fixture: ComponentFixture<CreatorVideosViewersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatorVideosViewersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatorVideosViewersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
