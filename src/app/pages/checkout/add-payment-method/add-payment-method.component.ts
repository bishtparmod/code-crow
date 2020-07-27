import { Component, OnInit, Inject } from '@angular/core';
import { StripeToken, StripeSource } from "stripe-angular"
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PaymentService } from '../../../services/payment.service'

@Component({
  selector: 'app-add-payment-method',
  templateUrl: './add-payment-method.component.html',
  styleUrls: ['./add-payment-method.component.scss']
})
export class AddPaymentMethodComponent implements OnInit {

  public cardForm: FormGroup
  public loading: boolean = false
  public cardAdded: boolean = false
  public error

  constructor(
    private paymentService: PaymentService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddPaymentMethodComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.buildStripeForm()
  }

  public buildStripeForm() {
    this.cardForm = this.fb.group({
      name: [null, Validators.required],
      address_city: [null, Validators.required],
      address_line1: [null, Validators.required],
      address_line2: [""],
      address_state: [null, Validators.required],
      address_zip: [null, Validators.compose([Validators.required])]
    })
  }

  onStripeInvalid(error: Error) {
    console.log('Validation Error', error)
  }

  async setStripeToken(token: StripeToken) {
    try {
      this.loading = true
      this.error = null
      // const cardAdded = await this.paymentService.stripeCreateCustomerSource(this.data, token)
      const intentcardAdd : any = await this.paymentService.stripeCreateSetupIntent(this.data)
      console.log("add card intent",intentcardAdd)
      const confirmcard = await this.paymentService.stripeConfirmSetupIntent(intentcardAdd.id)
      console.log("card confirm",confirmcard)
      this.loading = false
      this.cardAdded = true
      setTimeout(() => {
        this.dialogRef.close()
      }, 500)
      // console.log(cardAdded)
    } catch (e) {
      this.loading = false
      console.log('>> ERROR', e)
      this.error = e.error.raw.message
    }
  }

  setStripeSource(source: StripeSource) {
    console.log('Stripe source', source)
  }

  onStripeError(error: Error) {
    console.error('Stripe error', error)
  }

}
