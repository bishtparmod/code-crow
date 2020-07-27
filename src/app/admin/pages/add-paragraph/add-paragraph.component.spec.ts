import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddParagraphComponent } from './add-paragraph.component';

describe('AddParagraphComponent', () => {
  let component: AddParagraphComponent;
  let fixture: ComponentFixture<AddParagraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddParagraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddParagraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
