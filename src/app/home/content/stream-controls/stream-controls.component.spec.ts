import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamControlsComponent } from './stream-controls.component';

describe('StreamControlsComponent', () => {
  let component: StreamControlsComponent;
  let fixture: ComponentFixture<StreamControlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StreamControlsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
