import { Component, OnInit, ViewChild } from '@angular/core';
import { PaymentService } from '../../../services/payment.service';
import { MatDialog } from '@angular/material/dialog';
import { AddProductComponent } from './add-product/add-product.component'
import Swal from 'sweetalert2'

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  public selectedProduct: string = null
  public productName: string = null

  constructor(
    public paymentService: PaymentService,
    public dialog: MatDialog
  ) { }


  selectProduct(productId: string, productName: string) {
    this.selectedProduct = productId
    this.productName = productName
  }

  goBack() {
    this.selectedProduct = null
  }

  async ngOnInit() {

  }

  addProduct(): void {
    this.dialog.open(AddProductComponent, {
      width: '900px'
    })
  }

}
