import { Component, OnInit, ViewChild, Input } from '@angular/core'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { MatInput } from '@angular/material/input'
import { MatProgressSpinner } from '@angular/material/progress-spinner'
import { MatTable } from '@angular/material/table'
import { MatTableDataSource } from '@angular/material/table'
import { ChartDataSets, ChartOptions } from 'chart.js'
import { Color, Label } from 'ng2-charts'
import * as moment from 'moment'
import * as _ from 'lodash'
import { CreatorSpaceService } from '../../../pages/creator-space/creator-space.service'
import { AdminService } from '../../../services/admin.service'


@Component({
  selector: 'app-admin-video-table',
  templateUrl: './admin-video-table.component.html',
  styleUrls: ['./admin-video-table.component.scss']
})
export class AdminVideoTableComponent implements OnInit {

  public videosWithCount: any

   @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ViewChild(MatSort) sort: MatSort;

  public date = new Date()
  public monthFirstDay = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
  public monthLastDay = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0);
  public arrayofDays = this.getDates(this.monthFirstDay, this.monthLastDay, 'YYYY-MM-DD')
  public momentDate = moment(this.date).format('MMMM-YYYY')

  public displayedColumns: string[] = ['title', 'createdAt', 'views', 'rate', 'duration', 'status', 'delete', 'options']
  public dataSource: MatTableDataSource<any>
  public video: any

  public videos: any

  public filter: string = '';
  public sortOrder: string = 'asc';
  public pageNumber: number = 0;
  public pageLimit: number = 5;
  public totalCount: number = 0;

  constructor(
    public api: CreatorSpaceService,
    private adminApi: AdminService
  ) { 
  }

  showStatistics(video) {
    this.video = video
    const timestamps = _(this.video.views).map(view => view.viewsTimestamps).flatten().value()

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

  async activate($event, id) {
    try {
      const status = $event.checked
      await this.api.toggleVideoStatus(id, status)
    } catch (e) {
      console.log(e)
    }
  }

  async deleteVideo(id: string) {
    try {
      const state = confirm(`Deleting a video can not be undone. Note that you can always set your videos to private to hide them. Are you sure you want to proceed?`)
      if (state)
        await this.api.deleteVideo(id)
    } catch (e) {
      console.log(e)
    }
  }

  toggleView() {
    this.video = null
  }

  async ngOnInit() {
    try {
      this.videosWithCount = await this.adminApi.getVideos()
      this.videos = this.videosWithCount.videos
      this.videos.forEach((video: any) => {
        video.totalViews = 0
        if(video.views.length) {
          video.totalViews = video.views.map(view => view.viewCounter).reduce((a, b) => a + b)
        }
        video.totalRate = Math.round((video.likes.filter(like => like.status).length / video.likes.length) * 100)
      })
      this.dataSource = new MatTableDataSource(this.videos)
      this.totalCount = this.videosWithCount.count
    } catch(e) {
      console.log(e)
    }
  }

  public changePage($event) {
      this.pageLimit = $event.pageSize
      this.pageNumber = $event.pageIndex 
      this.loadVideosPage()
  }

  async loadVideosPage() {
    this.videosWithCount = await this.adminApi.getVideos(this.filter, this.sortOrder, this.pageNumber, this.pageLimit)
    this.dataSource = new MatTableDataSource(this.videosWithCount.videos)
    this.totalCount = this.videosWithCount.count
  }

  async applyFilter(filterValue: string) {
    this.filter = filterValue.trim();
    this.pageNumber = 0;
    await this.loadVideosPage();
    if(this.dataSource.paginator){
      this.dataSource.paginator.firstPage();
    }
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
