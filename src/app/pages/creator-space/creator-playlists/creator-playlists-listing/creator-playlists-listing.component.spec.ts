import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatorPlaylistsListingComponent } from './creator-playlists-listing.component';

describe('CreatorPlaylistsListingComponent', () => {
  let component: CreatorPlaylistsListingComponent;
  let fixture: ComponentFixture<CreatorPlaylistsListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatorPlaylistsListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatorPlaylistsListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
