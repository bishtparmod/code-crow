import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { PaymentService } from '../../services/payment.service'
import { ActivatedRoute, Router } from '@angular/router'
import { TokenStorage } from '../../auth/token.storage'
import { AddPaymentMethodComponent } from './add-payment-method/add-payment-method.component'

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  private planId: string
  public plan: any
  public customer: any
  private customerId: string
  public sources: Array<any>
  public source: any
  public date = new Date()
  private dateNow = new Date()
  public dateNext = this.dateNow.setDate(this.dateNow.getDate() + 30)
  public loading: boolean = false
  public isSubscribed: boolean = false
  private invoiceId: string
  public error: any
  public autoCharge: boolean = true
  public isPaid: boolean = false

  constructor(
    private router: Router,
    private paymentService: PaymentService,
    private route: ActivatedRoute,
    private tokenStorage: TokenStorage,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.plan = { nickname: "" }
    this.route.params.subscribe(async data => {
      this.planId = data.planId
      try {
        this.plan = await this.paymentService.stripeGetPlan(this.planId)
        const user: any = await this.tokenStorage.getUser().toPromise()
        this.customerId = JSON.parse(user).customerId
        this.customer = await this.paymentService.stripeGetCustomer(this.customerId)
        this.sources = this.customer.sources.data
      } catch (e) {
        console.log(e)
      }
    })
  }

  async subscribe() {
    try {
      this.loading = true
      const subscription: any = await this.paymentService.stripeCreateSubscription({ planId: this.planId, customerId: this.customer.id, autoCharge: this.autoCharge })
      console.log("subscription == >",this.customer)
      if (this.customer.subscriptions.data.length)
        await this.paymentService.stripeDeleteSubscription(this.customer.subscriptions.data[0].id)

      this.invoiceId = subscription.latest_invoice
      this.loading = false
      if (this.autoCharge) {
        this.isPaid = true
        setTimeout(() => {
          this.router.navigate(['/'])
        }, 2000)
      } else {
        this.isSubscribed = true
      }
    } catch (e) {
      console.log(e)
      if (e.error.message == "You're already subscribed to this plan") {
        this.invoiceId = e.error.subscription.latest_invoice
        this.loading = false
        this.isSubscribed = true
      } else if (e.error.raw) {
        this.error = e.error.raw.message
      }
    }
  }

  async pay() {
    try {
      this.loading = true
      this.error = null
      const pay = await this.paymentService.stripePayInvoice(this.invoiceId, { source: this.source.id })
      this.loading = false
      this.isSubscribed = false
      this.isPaid = true
    } catch (e) {
      if (e.error) {
        this.error = e.error.raw.message
      }
      console.log(e)
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

  async selectCard(source, index) {
    try {
      const updateCard = await this.paymentService.stripeSetDefaultCard(this.customer.id, source.id)
      this.sources.forEach(($souce, $index) => { $souce.selected = index == $index ? true : false })
      this.source = source
    } catch (e) {
      console.log(e)
    }

  }

}
