import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog'
import { PaymentService } from '../../../../services/payment.service'
import { TokenStorage } from '../../../../auth/token.storage'
import { AddPaymentMethodComponent } from '../../../checkout/add-payment-method/add-payment-method.component'

@Component({
  selector: 'app-account-cards',
  templateUrl: './account-cards.component.html',
  styleUrls: ['./account-cards.component.scss']
})
export class AccountCardsComponent implements OnInit {

  constructor(
    private paymentService: PaymentService,
    private tokenStorage: TokenStorage,
    private dialog: MatDialog
  ) { }

  public customerId: string
  public customer: any
  public sources: any[]
  public loadingSources: boolean
  public error: string
  public subscriptions: any

  async ngOnInit() {
    try {
      this.loadingSources = true
      const user: any = await this.tokenStorage.getUser().toPromise()
      this.customerId = JSON.parse(user).customerId
      this.customer = await this.paymentService.stripeGetCustomer(this.customerId)
      this.sources = this.customer.sources.data
      this.loadingSources = false
    } catch (e) {
      this.error = "An error has occured, please check your connection and try again."
    }
  }

  openDialog() {
    const dialog = this.dialog.open(AddPaymentMethodComponent, {
      width: '450px',
      data: this.customer.id
    })
    dialog.afterClosed().subscribe(async () => {
      this.customer = await this.paymentService.stripeGetCustomer(this.customerId)
      this.sources = this.customer.sources.data
    })
  }

  async deletePaymentMethod(index) {
    try {
      this.sources[index].loading = true
      const source = await this.paymentService.deleteSource(this.customer.id, this.sources[index].id)
      this.sources[index].loading = false
      setTimeout(() => {
        this.sources.splice(index, 1)
      }, 100)
    } catch (e) {
      console.log(e)
    }
  }

  async makeDefault(source) {
    try {
      source.loading = true
      const $source = await this.paymentService.stripeSetDefaultCard(this.customer.id, source.id)
      source.loading = false
      this.customer.default_source = source.id
    } catch (e) {
      console.log(e)
    }
  }

}
