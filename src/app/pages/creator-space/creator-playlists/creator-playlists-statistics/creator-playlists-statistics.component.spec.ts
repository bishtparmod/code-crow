import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatorPlaylistsStatisticsComponent } from './creator-playlists-statistics.component';

describe('CreatorPlaylistsStatisticsComponent', () => {
  let component: CreatorPlaylistsStatisticsComponent;
  let fixture: ComponentFixture<CreatorPlaylistsStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatorPlaylistsStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatorPlaylistsStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
