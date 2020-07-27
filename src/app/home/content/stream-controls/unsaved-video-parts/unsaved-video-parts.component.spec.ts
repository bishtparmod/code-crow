import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnsavedVideoPartsComponent } from './unsaved-video-parts.component';

describe('UnsavedVideoPartsComponent', () => {
  let component: UnsavedVideoPartsComponent;
  let fixture: ComponentFixture<UnsavedVideoPartsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnsavedVideoPartsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnsavedVideoPartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
