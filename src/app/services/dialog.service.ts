import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogData } from '../shared/dialog-data';
import { DialogComponent } from '../controls/dialog/dialog.component';

@Injectable()
export class DialogService {
  private dialogRef: MatDialogRef<DialogComponent>;

  constructor(public dialog: MatDialog) { }

  openDialog(data: DialogData, additionalDialogConfigData?: any): MatDialogRef<DialogComponent> {

    if (this.dialogRef) {
      this.dialogRef.close();
    }
    this.dialogRef = this.dialog.open(DialogComponent, {
      width: '500px',
      data,
      ...additionalDialogConfigData
    });

    this.dialogRef.afterClosed().subscribe(result => {
    });

    return this.dialogRef;
  }
}