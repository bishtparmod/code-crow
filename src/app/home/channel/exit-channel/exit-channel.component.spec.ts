import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExitChannelComponent } from './exit-channel.component';

describe('ExitChannelComponent', () => {
  let component: ExitChannelComponent;
  let fixture: ComponentFixture<ExitChannelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExitChannelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExitChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
