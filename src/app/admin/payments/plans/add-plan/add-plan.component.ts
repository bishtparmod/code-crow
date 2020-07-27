import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../../../../services/payment.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms'

@Component({
  selector: 'app-add-plan',
  templateUrl: './add-plan.component.html',
  styleUrls: ['./add-plan.component.scss']
})
export class AddPlanComponent implements OnInit {

  planForm: FormGroup

  constructor(
    public paymentService: PaymentService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddPlanComponent>,
  ) { }

  isLoading: boolean = false
  isAdded: boolean = false
  error: boolean = false
  async addPlan() {
    if (this.planForm.valid) {
      try {
        this.isLoading = true
        this.planForm.value.amount = this.planForm.value.amount * 100
        this.planForm.value.active = true
        this.planForm.value.product.metadata = {}
        for (let i = 0; i < this.planForm.value.product.attributes.length; i++) {
          this.planForm.value.product.metadata[i] = this.planForm.value.product.attributes[i]
        }
        delete this.planForm.value.product.attributes
        const plan = await this.paymentService.stripeCreatePlan(this.planForm.value)
        this.isLoading = false
        this.isAdded = true
        this.ngOnInit()
        setTimeout(() => {
          this.dialogRef.close()
        }, 500)
      } catch (e) {
        this.isLoading = false
        this.error = true
        console.log(e)
      }
    }
  }

  ngOnInit() {
    this.planForm = this.fb.group({
      amount: [null, Validators.required],
      product: this.fb.group({
        type: ['service', Validators.required],
        name: [null, Validators.required],
        attributes: this.fb.array([])
      }),
      interval: [null, Validators.required],
      interval_count: [null, Validators.required],
      active: [true, Validators.required],
      trial_period_days: [null, Validators.required]
    })
  }

  addAttribute() {
    const items = this.planForm.get("product.attributes") as FormArray
    items.push(new FormControl(null, Validators.required))
  }
  removeAttribute(i) {

  }
}
