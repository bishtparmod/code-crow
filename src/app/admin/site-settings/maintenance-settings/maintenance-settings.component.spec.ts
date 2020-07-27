import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceSettingsComponent } from './maintenance-settings.component';

describe('MaintenanceSettingsComponent', () => {
  let component: MaintenanceSettingsComponent;
  let fixture: ComponentFixture<MaintenanceSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintenanceSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenanceSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
