import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubcancelComponent } from './subcancel.component';

describe('SubcancelComponent', () => {
  let component: SubcancelComponent;
  let fixture: ComponentFixture<SubcancelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubcancelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubcancelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
