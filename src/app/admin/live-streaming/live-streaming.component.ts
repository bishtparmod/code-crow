import { Component, OnInit, ViewChild } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { TokenStorage } from '../../auth/token.storage'
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';
import * as moment from 'moment';
import value from '*.json';
import * as _ from 'lodash';
import { AdminService } from '../../services/admin.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-live-streaming',
  templateUrl: './live-streaming.component.html',
  styleUrls: ['./live-streaming.component.scss']
})
export class LiveStreamingComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  public displayedColumns: string[] = ['title', 'lastStreamTimestamp', 'options']
  public streamDisplayedColumns: string[] = ['title', 'duration', 'startDate', 'endDate', 'participants', 'options']
  public streamParticipantsDisplayedColumns: string[] = ['username', 'duration', 'startDate', 'endDate', 'rate']
  public dataSource: MatTableDataSource<any>
  public streamsDatasource: MatTableDataSource<any>
  public streamParticipantsDatasource: MatTableDataSource<any>

  public date = new Date()
  public monthFirstDay = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
  public monthLastDay = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0);
  public arrayofDays = this.getDates(this.monthFirstDay, this.monthLastDay, 'YYYY-MM-DD')
  public momentDate = moment(this.date).format('MMMM-YYYY')

  public channels: any[] = []
  public channelObj: any
  public liveStreams: any = []
  public streamObj: any
  public streamParticipants: any = []
  public totalStreamingTime: any
  public avgStreamingTime: any
  public uniqueParticipantsCount: any

  constructor(
    public chatService: ChatService,
    public tokenStorage: TokenStorage,
    public api: AdminService
  ) {
    this.dataSource = new MatTableDataSource(this.channels)
    this.streamsDatasource = new MatTableDataSource(this.liveStreams)
    this.streamParticipantsDatasource = new MatTableDataSource(this.streamParticipants)
  }


  async ngOnInit() {
    const livestreamings = await this.api.getMonthLiveStreaming()
    const values = this.getMonthActivity(livestreamings, 'startDate')
    const data = new Array(this.lineChartLabels.length).fill(0)
    this.arrayofDays.forEach((day, index) => {
      data[index] = values[day] ? values[day].reduce((accumulator, currentValue) => accumulator + currentValue.duration, 0) : 0
    })
    this.lineChartData[0].data = data

    this.channels = await this.api.getChannels()
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource = new MatTableDataSource(this.channels)

  }

  async showChannel(channel) {
    const { _id } = channel
    const liveStreams = await this.api.getChannelLiveStreams(_id)
    this.channelObj = { channel, liveStreams }
    this.totalStreamingTime = liveStreams.length ? liveStreams.reduce((accumulator, currentValue) => accumulator + currentValue.duration, 0) : 0
    this.avgStreamingTime = liveStreams.length ? this.totalStreamingTime / liveStreams.length : 0
    const allParticipants = _.flattenDeep(liveStreams.map(stream => stream.participants))
    this.uniqueParticipantsCount = allParticipants.length ? _.uniqBy(allParticipants, 'username').length : 0

    this.streamsDatasource.paginator = this.paginator;
    this.streamsDatasource.sort = this.sort;
    this.streamsDatasource = new MatTableDataSource(liveStreams)
  }

  public showStream(stream) {
    stream.avgWatchTime = Math.floor(stream.participants.reduce((accumulator, currentValue) => accumulator + currentValue.duration, 0) / stream.participants.length)
    stream.avgRate = Math.floor(stream.participants.reduce((accumulator, currentValue) => accumulator + currentValue.rate, 0) / stream.participants.length)
    this.streamObj = stream
    this.streamParticipantsDatasource.paginator = this.paginator;
    this.streamParticipantsDatasource.sort = this.sort;
    this.streamParticipantsDatasource = new MatTableDataSource(this.streamObj.participants)
  }

  public back() {
    this.channelObj = null
    this.streamObj = null
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

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  streamApplyFilter(filterValue: string) {
    this.streamsDatasource.filter = filterValue.trim().toLowerCase();
    if (this.streamsDatasource.paginator) {
      this.streamsDatasource.paginator.firstPage();
    }
  }

  participantsApplyFilter(filterValue: string) {
    this.streamParticipantsDatasource.filter = filterValue.trim().toLowerCase();
    if (this.streamParticipantsDatasource.paginator) {
      this.streamParticipantsDatasource.paginator.firstPage();
    }
  }

  public lineChartData: ChartDataSets[] = [
    {
      data: [],
      fill: false,
      label: "Duration (sec.)"
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