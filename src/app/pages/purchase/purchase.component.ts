import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { PaymentService } from '../../services/payment.service'
import { ActivatedRoute, Router } from '@angular/router'
import { TokenStorage } from '../../auth/token.storage'
import { AddPaymentMethodComponent } from '../checkout/add-payment-method/add-payment-method.component'

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.scss']
})
export class PurchaseComponent implements OnInit {

  private skuId: string
  public sku: any
  public product: any

  public ParticipantsAllowed: number
  public RecordingTime: number
  public StreamingTime: number

  public customer: any
  private customerId: string
  public sources: Array<any>
  public source: any
  public loading: boolean = false
  public error: any
  public isPaid: boolean = false

  constructor(
    private router: Router,
    private paymentService: PaymentService,
    private route: ActivatedRoute,
    private tokenStorage: TokenStorage,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.route.params.subscribe(async data => {
      this.skuId = data.skuId
      try {
        this.sku = await this.paymentService.stripeGetSKU(this.skuId)
        this.product = await this.paymentService.stripeGetProduct(this.sku.product)
        const user: any = await this.tokenStorage.getUser().toPromise()
        this.customerId = JSON.parse(user).customerId
        this.customer = await this.paymentService.stripeGetCustomer(this.customerId)
        this.sources = this.customer.sources.data
        console.log("cutomer == >",this.customer)
        var test = await this.paymentService.stripeGetSetupIntent(this.customerId)
        console.log("getintents",test)
        this.ParticipantsAllowed = this.sku.attributes.ParticipantsAllowed
        this.RecordingTime = this.sku.attributes.RecordingTime / 60
        this.StreamingTime = this.sku.attributes.StreamingTime / 60
      } catch (e) {
        console.log(e)
      }
    })
  }


  async pay() {
    try {
      const user: any = await this.tokenStorage.getUser().toPromise()
      const userId = JSON.parse(user)._id
      this.loading = true
      const charge: any = await this.paymentService.stripeCreateCharge({
        source: this.source.id,
        amount: this.sku.price,
        customer: this.customer.id,
        description: "Streaming minutes purchase"
      })
     
      if (charge.paid) {
        const streamTime = await this.paymentService.createSteamTime({
          purchasedMinutes: this.sku.attributes.StreamingTime,
          productId: this.product.id,
          chargeId: charge.id,
          userId:userId
        })
        this.loading = false
        this.isPaid = true
        setTimeout(() => {
          this.router.navigate(['/'])
        }, 1500)
      } else {
        console.log(charge)
      }
    } catch (e) {
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
