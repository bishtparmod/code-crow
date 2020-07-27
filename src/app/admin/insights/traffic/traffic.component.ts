import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';

@Component({
  selector: 'app-traffic',
  templateUrl: './traffic.component.html',
  styleUrls: ['./traffic.component.scss']
})
export class TrafficComponent implements OnInit {

  public lineChartData: ChartDataSets[] = [
    {
      data: [53, 87, 88, 83, 41, 12, 85, 14, 10, 17, 31, 4, 99, 14, 50, 35, 95, 96, 17, 8, 6, 55, 10, 91, 1, 44, 56, 53, 30, 91],
      fill: false,
      label: 'Current'
    },
    {
      data: [59, 98, 89, 20, 25, 67, 19, 50, 89, 6, 66, 10, 59, 38, 69, 58, 52, 81, 45, 23, 64, 4, 33, 24, 29, 49, 61, 97, 32, 33],
      fill: false,
      label: 'Previous'
    },
    {
      data: [-6, -11, -1, 63, 16, -55, 66, -36, -79, 11, -35, -6, 40, -24, -19, -23, 43, 15, -28, -15, -58, 51, -23, 67, -28, -5, -5, -44, -2, 58],
      fill: false,
      label: 'Difference'
    }
  ];
  public lineChartLabels: Label[] = [
    'M', 'T', 'W', 'T', 'F', 'S', 'S', 'M', 'T', 'W', 'T', 'F', 'S', 'S', 'M', 'T', 'W', 'T', 'F', 'S', 'S', 'M', 'T', 'W', 'T', 'F', 'S', 'S'
  ];
  public lineChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      gridLines: {
        display: false
      }
    },
    maintainAspectRatio: false
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

  constructor() { }

  ngOnInit() {
  }

}
