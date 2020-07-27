import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ChatService } from "../../../services/chat.service";

interface channel {
  sid: string
  user: string
  title: string
}

@Component({
  selector: 'app-donate-dialog',
  templateUrl: './donate-dialog.component.html',
  styleUrls: ['./donate-dialog.component.scss']
})
export class DonateDialogComponent implements OnInit {

  @ViewChild('amountInput', { static: true }) private amountInput;
  public testPrice: any

  constructor(
    private dialogRef: MatDialogRef<DonateDialogComponent>,
    public chatService: ChatService,
    @Inject(MAT_DIALOG_DATA) public data: channel
  ) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  addPayment(val: number) {
    this.amountInput.nativeElement.value = val
  }

  submitDonation() {
    console.log(">> Payment submitted")
  }
}