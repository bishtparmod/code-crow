import { Component, OnInit, Input } from '@angular/core'
import { Router } from '@angular/router'
import { PaymentService } from '../../../services/payment.service'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { SubcancelComponent } from '../subcancel/subcancel.component'
import { TokenStorage } from '../../../auth/token.storage'
import { DialogData } from '../../../shared/dialog-data'
import { DialogService } from '../../../services/dialog.service'
import { MatSnackBar } from '@angular/material/snack-bar'

@Component({
  selector: 'app-pricing-tiers',
  templateUrl: './pricing-tiers.component.html',
  styleUrls: ['./pricing-tiers.component.scss']
})
export class PricingTiersComponent {
  @Input() plan: any
  @Input() previousPlanName: any
  @Input() isSubscriptionLoaded: any

  constructor(
    private router: Router,
    private tokenStorage: TokenStorage,
    private paymentService: PaymentService,
    private dialog: MatDialog,
    private dialogService: DialogService,
    private snackBar: MatSnackBar
  ) { }

  public async subscribe(planId) {
    try {
      const user: any = await this.tokenStorage.getUser().toPromise()
      const { customerId } = JSON.parse(user)
      const customer: any = await this.paymentService.stripeGetCustomer(customerId)
      if (customer && customer.subscriptions.data.length) {
        if(this.plan) {
          this.dialog.open(SubcancelComponent, {
            width: '900px',
            data: {
              subscriptions: customer.subscriptions.data,
              planId: this.plan.id
            }
          })
        } else {
          this.openDialogDeleteSubscription(customer.subscriptions[0].id)
        }
      } else {
        this.router.navigate([`/checkout/${planId}`])
      }
    } catch (e) {
      console.log(e)
    }
  }

  async openDialogDeleteSubscription(id) {
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
          await this.paymentService.stripeDeleteSubscription(id)
          this.router.navigate(['/'])
        }
      } catch (e) {
        this.snackBar.open('An error has occured, please try again later.', null, { duration: 2000 })
      }
    });
  }
}
