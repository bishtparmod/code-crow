import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminVideoTableComponent } from './admin-video-table.component';

describe('AdminVideoTableComponent', () => {
  let component: AdminVideoTableComponent;
  let fixture: ComponentFixture<AdminVideoTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminVideoTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminVideoTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
