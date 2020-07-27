import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthenticateComponent } from './authenticate.component';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { AuthService } from '../auth.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TokenStorage } from '../token.storage';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('AuthenticateComponent', () => {
  let component: AuthenticateComponent;
  let fixture: ComponentFixture<AuthenticateComponent>;

  beforeEach(async(() => {
    var mockActivatedRoute = { snapshot: { paramMap:
      convertToParamMap({ 
        email: "test@test.com", username: "test_username", token: 123       
      })
    }};
    TestBed.configureTestingModule({
      declarations: [ AuthenticateComponent ],
      imports: [ HttpClientTestingModule ],
      providers: [ { provide: ActivatedRoute, useClass: class { navigate = jasmine.createSpy("navigate"); } }, 
      { provide: Router, useClass: class { navigate = jasmine.createSpy("navigate"); } }, AuthService, TokenStorage, { provide: ActivatedRoute, useValue: mockActivatedRoute } ]    
    })
    .compileComponents();
  }));
  
  beforeEach(() => {
    fixture = TestBed.createComponent(AuthenticateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
