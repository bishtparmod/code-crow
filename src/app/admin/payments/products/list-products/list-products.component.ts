import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PaymentService } from '../../../../services/payment.service';

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.scss']
})
export class ListProductsComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @Input() selectProduct

  public products: any
  public loaded: boolean
  public error: boolean
  public displayedColumns: string[] = ['id', 'name', 'active', 'type', 'created', 'options']
  public dataSource: MatTableDataSource<any>

  constructor(
    public paymentService: PaymentService
  ) { }

  private async loadProducts() {
    try {
      const products: any = await this.paymentService.stripeGetProducts()
      this.products = products.data
      this.dataSource = new MatTableDataSource(this.products)
      this.dataSource.paginator = this.paginator
      this.dataSource.sort = this.sort
      this.loaded = true
      return Promise.resolve(this.products)
    } catch (e) {
      this.error = true
      return Promise.reject(e)
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  async deleteProduct(productId: string) {
    try {
      await this.paymentService.stripeDeleteProduct(productId)
      this.ngOnInit()
    } catch (e) {
      console.log(e)
    }
  }

  ngOnInit() {
    this.loadProducts()
  }

}
