import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PaymentService } from '../../../services/payment.service';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss']
})
export class SubscriptionsComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  public subscriptions: any
  public loaded: boolean
  public error: boolean
  public displayedColumns: string[] = ['plan', 'customer', 'collection_method', 'amount', 'current_period_start', 'current_period_end', 'options']
  public dataSource: MatTableDataSource<any>

  constructor(
    public paymentService: PaymentService
  ) { }

  private async loadSubscriptions() {
    try {
      const subscriptions: any = await this.paymentService.stripeGetSubscriptions()
      this.subscriptions = subscriptions.data
      this.dataSource = new MatTableDataSource(this.subscriptions)
      this.dataSource.paginator = this.paginator
      this.dataSource.sort = this.sort
      this.loaded = true
      return Promise.resolve(this.subscriptions)
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
    await this.loadSubscriptions()
    this.prepareChart()
    console.log(this.lineChartData)
  }

  public isShowingTable: boolean = true
  public isShowingChart: boolean = false
  toggleView() {
    this.isShowingChart = !this.isShowingChart
    this.isShowingTable = !this.isShowingTable
  }

  public date = new Date(1571173356)
  public monthFirstDay = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
  public monthLastDay = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0);
  public arrayofDays = this.getDates(this.monthFirstDay, this.monthLastDay, 'YYYY-MM-DD')
  public momentDate = moment(this.date).format('MMMM-YYYY')

  public prepareChart() {
    const values = this.getMonthActivity(this.subscriptions, 'current_period_end')
    const data = new Array(this.lineChartLabels.length).fill(0)
    const $data = new Array(this.lineChartLabels.length).fill(0)
    console.log(values)
    this.arrayofDays.forEach((day, index) => {
      data[index] = values[day] ? values[day].reduce((accumulator, currentValue) => accumulator + (currentValue.plan.amount / 100), 0) : 0
    })
    this.arrayofDays.forEach((day, index) => {
      $data[index] = values[day] ? values[day].length : 0
    })
    this.lineChartData[0].data = data
    this.lineChartData[1].data = $data
  }

  public getDates(startDate, stopDate, format) {
    const dateArray = [];
    let currentDate = moment(startDate);
    const $stopDate = moment(stopDate);
    while (currentDate <= $stopDate) {
      dateArray.push(moment(currentDate).format(format))
      currentDate = moment(currentDate).add(1, 'days');
    }
    return dateArray;
  }

  public getMonthActivity(arr, key) {
    const obj = {}
    arr.forEach(value => {
      const int = moment(value[key]).format('YYYY-MM-DD')
      obj[int] ? obj[int].push(value) : obj[int] = [value]
    })
    return obj
  }

  public getWeekActivity(arr, key, that, id) {
    const weekObj = {}
    const weekofYear = arr.map(val => {
      const int = moment(val[key]).format('w')
      weekObj[int] ? weekObj[int].push(val) : weekObj[int] = [val]
      return parseInt(int)
    })
    const maxNumber = Math.max(...weekofYear)
    const lastWeekActivity = weekObj[maxNumber.toString()]
    const dayObj = {}
    const dayofWeek = lastWeekActivity.map(value => {
      const int = moment(value[key]).format('d')
      dayObj[int] ? dayObj[int].push(value) : dayObj[int] = [value]
      return parseInt(int)
    })
    this[id] = dayObj
    const values = this[that].map((day, i) => dayObj[i.toString()] ? dayObj[i.toString()].length : 0)
    return values
  }

  public lineChartData: ChartDataSets[] = [
    {
      data: [],
      fill: false,
      label: "Income ($)",
      yAxisID: 'A',
    },
    {
      data: [],
      fill: false,
      label: "Subs",
      yAxisID: 'B',
    }
  ]
  public lineChartLabels: Label[] = this.getDates(this.monthFirstDay, this.monthLastDay, 'dd-Do')
  public lineChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      gridLines: {
        display: false
      },
      yAxes: [{
        id: 'A',
        type: 'linear',
        position: 'left',
      }, {
        id: 'B',
        type: 'linear',
        position: 'right'
      }]
    },
    maintainAspectRatio: false,
    legend: {
      display: false
    }
  };
  public lineChartColors: Color[] = [
    {
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegend = true;
  public lineChartType = 'bar';

}
