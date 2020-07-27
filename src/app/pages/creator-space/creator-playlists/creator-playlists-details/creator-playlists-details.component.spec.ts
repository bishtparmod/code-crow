import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatorPlaylistsDetailsComponent } from './creator-playlists-details.component';

describe('CreatorPlaylistsDetailsComponent', () => {
  let component: CreatorPlaylistsDetailsComponent;
  let fixture: ComponentFixture<CreatorPlaylistsDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatorPlaylistsDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatorPlaylistsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
