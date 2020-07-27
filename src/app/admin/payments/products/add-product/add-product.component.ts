import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PaymentService } from '../../../../services/payment.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AddProductComponent>,
    private paymentService: PaymentService,
  ) { }

  isLoading: boolean = false
  isAdded: boolean = false
  error: boolean = false
  async addProduct() {
    const { name, caption, description } = this
    const obj = { name, type: 'good', caption, description, attributes: [] }
    obj.attributes = this.attributes
    try {
      this.isLoading = true
      const product = await this.paymentService.stripeCreateProduct(obj)
      this.isLoading = false
      this.isAdded = true
      setTimeout(() => {
        this.dialogRef.close()
      }, 500)
    } catch (e) {
      this.isLoading = false
      this.error = true
      console.log(e)
    }
  }

  ngOnInit() {
  }

  name: string = null
  type: string = 'good'
  description: string = null
  caption: string = null
  attributes: any[] = [null]
  addAttribute() {
    if (this.attributes.length <= 4) {
      this.attributes.push(null)
    }
  }
  removeAttribute(i) {
    this.attributes.splice(i, 1)
  }
  trackByIndex(index: number, obj: any): any {
    return index
  }

}
