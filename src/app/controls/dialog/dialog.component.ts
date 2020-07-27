import {Component, Inject, OnInit} from '@angular/core';
import {DialogData} from '../../shared/dialog-data';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, private dialogRef: MatDialogRef<DialogComponent>) {}

  ngOnInit() {
  }

  close() {
    this.dialogRef.close(true);
  }
}
