import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatorPlaylistsComponent } from './creator-playlists.component';

describe('CreatorPlaylistsComponent', () => {
  let component: CreatorPlaylistsComponent;
  let fixture: ComponentFixture<CreatorPlaylistsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatorPlaylistsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatorPlaylistsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
