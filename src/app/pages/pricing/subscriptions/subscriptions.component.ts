import { Component, OnInit } from '@angular/core'
import { PaymentService } from '../../../services/payment.service'
import { TokenStorage } from '../../../auth/token.storage'

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss']
})
export class SubscriptionsComponent implements OnInit {
  public subscriptions: any = []
  public isSubscriptionLoaded: any

  constructor(
    private tokenStorage: TokenStorage,
    private paymentService: PaymentService
  ) { }

  async ngOnInit() {
    const plans: any = await this.paymentService.stripeGetPlans({ active: true })
    this.subscriptions = plans.data.reverse()
    const plan = await this.getPlan()
    this.subscriptions.forEach(async (sub, index) => {
      if (!plan) {
        sub.isSubscribed = index == 0
      } else {
        sub.isSubscribed = sub.id == plan.id
      }
    })
    this.isSubscriptionLoaded = true
  }

  public async getPlan() {
    try {
      const user: any = await this.tokenStorage.getUser().toPromise()
      const { customerId } = JSON.parse(user)
      const customer: any = await this.paymentService.stripeGetCustomer(customerId)
      if (customer && customer.subscriptions.data.length) {
        return customer.subscriptions.data[0].plan
      } else {
        return null
      }
    } catch (e) {
      console.log(e)
    }
  }
}
