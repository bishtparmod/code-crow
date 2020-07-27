import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PaymentService } from '../../../../services/payment.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-refund-confirm',
  templateUrl: './refund-confirm.component.html',
  styleUrls: ['./refund-confirm.component.scss']
})
export class RefundConfirmComponent implements OnInit {

  displayedColumns: string[] = ['id', 'amount', 'created', 'reason', 'status']
  dataSource
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator

  public charge: any
  public loaded: boolean = false
  public error: boolean = false
  public hasRefunds: boolean = false

  public amount: number = 0
  public refundReason: string
  public isLoading: boolean = false
  public isRefunded: boolean = false
  public refundError: boolean = false

  constructor(
    public dialogRef: MatDialogRef<RefundConfirmComponent>,
    private paymentService: PaymentService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  private async getCharge(charge) {
    try {
      this.charge = charge
      this.loaded = true
      if (this.charge.refunds.data.length) {
        this.hasRefunds = true
        this.dataSource = new MatTableDataSource(this.charge.refunds.data)
        this.dataSource.paginator = this.paginator
      }
    } catch (e) {
      this.error = true
      console.log(e)
    }
  }

  private reloadCharge() {
    return new Promise(async (resolve, reject) => {
      try {
        const chargeId = this.charge.id
        this.charge = await this.paymentService.stripeGetCharge(chargeId)
        this.loaded = true
        if (this.charge.refunds.data.length) {
          this.hasRefunds = true
          this.dataSource = new MatTableDataSource(this.charge.refunds.data)
          this.dataSource.paginator = this.paginator
        }
        resolve()
      } catch (e) {
        this.error = true
        console.log(e)
        reject(e)
      }
    })
  }

  async ngOnInit() {
    await this.getCharge(this.data)
  }

  async createRefund() {
    const charge = this.charge.id
    this.isRefunded = false
    this.refundError = false
    if (this.amount && isFinite(this.amount) && this.amount > 0 && this.refundReason) {
      this.isLoading = true
      try {
        const amount = this.amount * 100
        const refund = await this.paymentService.stripeCreateRefund({ charge, amount, reason: this.refundReason })
        if (refund) {
          await this.reloadCharge()
          this.amount = 0
          this.refundReason = null
          this.isRefunded = true
          this.isLoading = false
        }
      } catch (e) {
        this.refundError = true
        this.isLoading = false
        console.log(e)
      }
    }
  }

}
