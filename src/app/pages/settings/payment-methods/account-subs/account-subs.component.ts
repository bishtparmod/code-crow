import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../../../../services/payment.service'
import { TokenStorage } from '../../../../auth/token.storage'
import { Router } from '@angular/router'
import { DialogService } from '../../../../services/dialog.service';
import { DialogData } from '../../../../shared/dialog-data';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-account-subs',
  templateUrl: './account-subs.component.html',
  styleUrls: ['./account-subs.component.scss']
})
export class AccountSubsComponent implements OnInit {

  constructor(
    private paymentService: PaymentService,
    private tokenStorage: TokenStorage,
    private router: Router,
    private dialogService: DialogService,
    private snackBar: MatSnackBar
  ) { }

  public customerId: string
  public customer: any
  public loadingSources: boolean
  public error: string
  public subscriptions: any[] = []

  async ngOnInit() {
    try {
      this.loadingSources = true
      const user: any = await this.tokenStorage.getUser().toPromise()
      this.customerId = JSON.parse(user).email
      this.customer = await this.paymentService.stripeGetCustomer(this.customerId)
      this.subscriptions = this.customer.subscriptions.data
      this.loadingSources = false
    } catch (e) {
      this.error = "An error has occured, please check your connection and try again."
    }
  }

  changePlan() {
    this.router.navigate(['/pricing'])
  }

  deleteSub() {
    const dialogData: DialogData = {
      title: 'Confirm subscription cancellation',
      message: 'Are you sure you want to cancel your subscription? This action is not changeable or refundable.',
      showOKBtn: true,
      showCancelBtn: true,
      okText: "Delete",
      cancelText: "Close"
    };
    const dialogRef = this.dialogService.openDialog(
      dialogData, { disableClose: true });

    dialogRef.afterClosed().subscribe(async result => {
      try {
        if (result) {
          await this.paymentService.stripeDeleteSubscription(this.subscriptions[0].id)
          this.ngOnInit()
        }
      } catch (e) {
        this.snackBar.open('An error has occured, please try again later.', null, { duration: 2000 })
      }
    });
  }
}
