import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ChannelComponent } from './channel.component';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from '../../filter.pipe';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

describe('ChannelComponent', () => {
  let component: ChannelComponent;
  let fixture: ComponentFixture<ChannelComponent>;
  let dialogSpy: jasmine.Spy;
  let dialogRefSpyObj = jasmine.createSpyObj({ afterClosed : of({}), close: null });
  dialogRefSpyObj.componentInstance = { body: '' };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChannelComponent, FilterPipe ],
      providers: [ MatDialog ],
      imports: [ FormsModule, RouterTestingModule, MatDialogModule],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    dialogSpy = spyOn(component, 'openDialog').and.returnValue(dialogRefSpyObj);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should run #openDialog() open', async () => {
    component.openDialog();
    expect(dialogSpy).toHaveBeenCalled();
  });

  // it('should run #openDialog() afterClosed', async () => {
  //   component.openDialog();
  //   component.dialog.closeAll();
  //   expect(dialogRefSpyObj.afterClosed).toHaveBeenCalled();
  // });
});
