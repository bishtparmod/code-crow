import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsImagesComponent } from './news-images.component';

describe('NewsImagesComponent', () => {
  let component: NewsImagesComponent;
  let fixture: ComponentFixture<NewsImagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewsImagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
