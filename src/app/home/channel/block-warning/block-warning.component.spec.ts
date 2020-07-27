import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockWarningComponent } from './block-warning.component';

describe('BlockWarningComponent', () => {
  let component: BlockWarningComponent;
  let fixture: ComponentFixture<BlockWarningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlockWarningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockWarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
