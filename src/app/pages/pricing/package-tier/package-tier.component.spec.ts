import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageTierComponent } from './package-tier.component';

describe('PackageTierComponent', () => {
  let component: PackageTierComponent;
  let fixture: ComponentFixture<PackageTierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackageTierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageTierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
