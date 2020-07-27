import { Component, OnInit, Input } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'app-admin-video-statistics',
  templateUrl: './admin-video-statistics.component.html',
  styleUrls: ['./admin-video-statistics.component.scss']
})
export class AdminVideoStatisticsComponent implements OnInit {

  @Input() videos: any

  public date = new Date()
  public monthFirstDay = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
  public monthLastDay = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0);
  public arrayofDays = this.getDates(this.monthFirstDay, this.monthLastDay, 'YYYY-MM-DD')
  public momentDate = moment(this.date).format('MMMM-YYYY')

  constructor(
  ) { }

  async ngOnInit() {
    const timestamps = _(this.videos).map(video => video.views).flatten().map((view: any) => view.viewsTimestamps).flatten().value()
    const values = this.getMonthActivity(timestamps, 'date')
    const viewsData = new Array(this.lineChartLabels.length).fill(0)
    const viewsDuration = new Array(this.lineChartLabels.length).fill(0)

    this.arrayofDays.forEach((day, index) => {
      viewsData[index] = values[day] ? values[day].reduce((accumulator, currentValue) => accumulator + 1, 0) : 0
    })
    this.arrayofDays.forEach((day, index) => {
      viewsDuration[index] = values[day] ? values[day].reduce((accumulator, currentValue) => accumulator + currentValue.duration, 0) : 0
    })

    this.lineChartData[0].data = viewsData
    this.lineChartData[1].data = viewsDuration
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

  public lineChartData: ChartDataSets[] = [
    {
      data: [],
      fill: false,
      label: "Views"
    },
    {
      data: [],
      fill: false,
      label: "Watch Time (s)"
    }
  ]
  public lineChartLabels: Label[] = this.getDates(this.monthFirstDay, this.monthLastDay, 'dd-Do')
  public lineChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      gridLines: {
        display: false
      }
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
  public lineChartType = 'line';

}
