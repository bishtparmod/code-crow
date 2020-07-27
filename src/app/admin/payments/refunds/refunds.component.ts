import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PaymentService } from '../../../services/payment.service';

@Component({
  selector: 'app-refunds',
  templateUrl: './refunds.component.html',
  styleUrls: ['./refunds.component.scss']
})
export class RefundsComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  refunds: any
  loaded: boolean
  error: boolean
  displayedColumns: string[] = ['id', 'charge', 'amount', 'created', 'reason', 'status']
  dataSource: MatTableDataSource<any>

  constructor(
    public paymentService: PaymentService
  ) { }

  private async loadRefunds() {
    try {
      const products: any = await this.paymentService.stripeGetRefunds()
      this.refunds = products.data
      this.dataSource = new MatTableDataSource(this.refunds)
      this.dataSource.paginator = this.paginator
      this.dataSource.sort = this.sort
      this.loaded = true
      return Promise.resolve(this.refunds)
    } catch (e) {
      console.log(e)
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

  async ngOnInit() {
    await this.loadRefunds()
  }

}
