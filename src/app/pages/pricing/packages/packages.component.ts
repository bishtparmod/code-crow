import { Component, OnInit } from '@angular/core'
import { PaymentService } from '../../../services/payment.service'
import * as _ from 'lodash'

@Component({
  selector: 'app-packages',
  templateUrl: './packages.component.html',
  styleUrls: ['./packages.component.scss']
})
export class PackagesComponent implements OnInit {
  public packages: any = []
  public products: any = []
  public isLoaded: boolean = false
  constructor(
    private paymentService: PaymentService
  ) { }

  async ngOnInit() {
    const packages: any = await this.paymentService.stripeGetSkus({ active: true })
    this.packages = packages.data.reverse()
    const productIds = _(this.packages.map(p => p.product)).uniq().value()
    this.products = await Promise.all(productIds.map(productId => this.paymentService.stripeGetProduct(productId)))
    if (this.packages.length && this.products.length) {
      this.packages.forEach($package => {
        $package.product = this.products.filter($product => $product.id == $package.product)[0]
      })
      this.isLoaded = true
    }
  }

}
