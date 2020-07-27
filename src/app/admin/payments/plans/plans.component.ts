import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PaymentService } from '../../../services/payment.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddPlanComponent } from './add-plan/add-plan.component'

@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.scss']
})
export class PlansComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  public plans: any
  public loaded: boolean
  public error: boolean
  public displayedColumns: string[] = ['id', 'name', 'active', 'amount', 'duration', 'created', 'activation', 'delete']
  public dataSource: MatTableDataSource<any>

  constructor(
    public paymentService: PaymentService,
    public dialog: MatDialog
  ) { }

  private async loadPlans() {
    try {
      const products: any = await this.paymentService.stripeGetPlans()
      this.plans = products.data
      this.dataSource = new MatTableDataSource(this.plans)
      this.dataSource.paginator = this.paginator
      this.dataSource.sort = this.sort
      this.loaded = true
      return Promise.resolve(this.plans)
    } catch (e) {
      console.log(e)
      this.error = true
      return Promise.reject(e)
    }
  }

  async stripeDeletePlan(planId) {
    try {
      const deletePlan = await this.paymentService.stripeDeletePlan(planId)
      if (deletePlan) {
        const products: any = await this.paymentService.stripeGetPlans()
        this.plans = products.data
        this.ngOnInit()
      }
    } catch (e) {
      console.log(e)
    }
  }

  activate($event, id) {
    const active = $event.checked
    this.paymentService.stripeUpdatePlan(id, { active })
      .then(res => {
        this.loadPlans()
      })
      .catch(err => console.log(err))
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  async ngOnInit() {
    await this.loadPlans()
  }

  openDialog() {
    this.dialog.open(AddPlanComponent, {
      width: '900px'
    })
  }

}
