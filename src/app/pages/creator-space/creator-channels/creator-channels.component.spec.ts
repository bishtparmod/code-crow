import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatorChannelsComponent } from './creator-channels.component';

describe('CreatorChannelsComponent', () => {
  let component: CreatorChannelsComponent;
  let fixture: ComponentFixture<CreatorChannelsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatorChannelsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatorChannelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
