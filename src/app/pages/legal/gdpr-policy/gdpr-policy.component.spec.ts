import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GdprPolicyComponent } from './gdpr-policy.component';

describe('GdprPolicyComponent', () => {
  let component: GdprPolicyComponent;
  let fixture: ComponentFixture<GdprPolicyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GdprPolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GdprPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
