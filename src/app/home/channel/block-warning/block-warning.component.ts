import { Component, OnInit, Inject, Injectable } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ChatService } from "../../../services/chat.service";
import { TokenStorage } from '../../../auth/token.storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

@Component({
  selector: 'app-block-warning',
  templateUrl: './block-warning.component.html',
  styleUrls: ['./block-warning.component.scss']
})
export class BlockWarningComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<BlockWarningComponent>,
    public chatService: ChatService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private tokenStorage: TokenStorage
  ) { }
  

  ngOnInit() {
  }

}
