import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatorSidenavComponent } from './creator-sidenav.component';

describe('CreatorSidenavComponent', () => {
  let component: CreatorSidenavComponent;
  let fixture: ComponentFixture<CreatorSidenavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatorSidenavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatorSidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
