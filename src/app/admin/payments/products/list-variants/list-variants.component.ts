import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PaymentService } from '../../../../services/payment.service';
import * as _ from 'lodash'

@Component({
  selector: 'app-list-variants',
  templateUrl: './list-variants.component.html',
  styleUrls: ['./list-variants.component.scss']
})
export class ListVariantsComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @Input() productId: string

  public product: any
  public skus: any
  public columns: Array<any>
  public displayedColumns: string[] = []
  public dataSource: MatTableDataSource<any>

  constructor(
    private paymentService: PaymentService
  ) { }

  async ngOnInit() {
    try {
      this.product = await this.paymentService.stripeGetProduct(this.productId)
      this.columns = [
        { name: 'id', label: 'ID' },
        { name: 'price', label: 'Price' },
        { name: 'active', label: 'Active' },
        ...this.product.attributes.map(att => ({ name: att, label: att.replace(/([A-Z])/g, ' $1').trim() }))
      ]
      this.displayedColumns = this.columns.map(col => col.name)
      const $skus: any = await this.paymentService.stripeGetProductSkus(this.productId)
      this.skus = $skus.data.map(sku => {
        const dynamicAttr = this.displayedColumns.slice(3)
        const returnValue = { id: sku.id, price: sku.price, active: sku.active }
        dynamicAttr.forEach(attr => { returnValue[attr] = sku.attributes[attr] })
        return returnValue
      })
      this.dataSource = new MatTableDataSource(this.skus)
      this.dataSource.paginator = this.paginator
      this.dataSource.sort = this.sort
    } catch (e) {
      console.log(e)
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
