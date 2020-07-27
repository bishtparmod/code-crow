import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListVariantsComponent } from './list-variants.component';

describe('ListVariantsComponent', () => {
  let component: ListVariantsComponent;
  let fixture: ComponentFixture<ListVariantsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListVariantsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListVariantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
