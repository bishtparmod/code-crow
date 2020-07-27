import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVariationComponent } from './add-variation.component';

describe('AddVariationComponent', () => {
  let component: AddVariationComponent;
  let fixture: ComponentFixture<AddVariationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddVariationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddVariationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
