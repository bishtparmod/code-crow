import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatorPlaylistsAddComponent } from './creator-playlists-add.component';

describe('CreatorPlaylistsAddComponent', () => {
  let component: CreatorPlaylistsAddComponent;
  let fixture: ComponentFixture<CreatorPlaylistsAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatorPlaylistsAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatorPlaylistsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
