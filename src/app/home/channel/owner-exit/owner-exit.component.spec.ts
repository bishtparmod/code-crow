import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerExitComponent } from './owner-exit.component';

describe('OwnerExitComponent', () => {
  let component: OwnerExitComponent;
  let fixture: ComponentFixture<OwnerExitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OwnerExitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnerExitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
