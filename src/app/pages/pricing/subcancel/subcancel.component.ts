import { Component, OnInit, Inject } from '@angular/core'
import { Router } from '@angular/router'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { PaymentService } from '../../../services/payment.service'

@Component({
  selector: 'app-subcancel',
  templateUrl: './subcancel.component.html',
  styleUrls: ['./subcancel.component.scss']
})
export class SubcancelComponent implements OnInit {
  public subscription
  public invalidPlan: boolean = false

  constructor(
    private router: Router,
    private paymentService: PaymentService,
    private dialog: MatDialogRef<SubcancelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  async ngOnInit() {
    this.subscription = this.data.subscriptions[0]
    if(this.subscription.plan.id == this.data.planId) {
      this.invalidPlan = true
    }
  }

  navigate() {
    this.router.navigate([`/checkout/${this.data.planId}`])
    this.dialog.close()
  }

}
