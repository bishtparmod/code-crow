import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatorVideosTableComponent } from './creator-videos-table.component';

describe('CreatorVideosTableComponent', () => {
  let component: CreatorVideosTableComponent;
  let fixture: ComponentFixture<CreatorVideosTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatorVideosTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatorVideosTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
