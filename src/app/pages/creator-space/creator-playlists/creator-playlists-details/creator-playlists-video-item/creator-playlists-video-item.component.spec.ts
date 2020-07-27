import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatorPlaylistsVideoItemComponent } from './creator-playlists-video-item.component';

describe('CreatorPlaylistsVideoItemComponent', () => {
  let component: CreatorPlaylistsVideoItemComponent;
  let fixture: ComponentFixture<CreatorPlaylistsVideoItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatorPlaylistsVideoItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatorPlaylistsVideoItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
