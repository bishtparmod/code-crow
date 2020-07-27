import { Component, OnInit, ViewChild, Input, ElementRef, Renderer2, EventEmitter, Output } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CreatorSpaceService } from '../../creator-space.service';
import { ChatService } from '../../../../services/chat.service';
import { VideoService } from '../../../../services/video.service';
import { TokenStorage } from '../../../../auth/token.storage';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import * as moment from 'moment';
import * as _ from 'lodash';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-creator-videos-table',
  templateUrl: './creator-videos-table.component.html',
  styleUrls: ['./creator-videos-table.component.scss']
})
export class CreatorVideosTableComponent implements OnInit {
  @Input() videos: any;
  @Output() videosEvent = new EventEmitter();
  @ViewChild('videoPreview', { static: false }) videoPreviewElement: ElementRef;
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  
  public file: File;
  public progress: number = 0;
  public videoURL;
  public videoDuration: number;
  public videoUploaded: boolean = false;

  public date = new Date()
  public monthFirstDay = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
  public monthLastDay = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0);
  public arrayofDays = this.getDates(this.monthFirstDay, this.monthLastDay, 'YYYY-MM-DD');
  public momentDate = moment(this.date).format('MMMM-YYYY');

  public displayedColumns: string[] = ['title', 'createdAt', 'views', 'rate', 'duration', 'status', 'delete', 'options', 'download']
  public dataSource: MatTableDataSource<any>
  public video: any;

  constructor(
    public chatService: ChatService,
    public tokenStorage: TokenStorage,
    public creatorSpaceService: CreatorSpaceService,
    public videoService: VideoService,
    public sanitizer: DomSanitizer,
    private renderer: Renderer2
  ) { }

  public async uploadVideo($event) {
    if ($event.target.files.length > 0) {
      this.file = $event.target.files[0];
      this.videoURL = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(this.file));
      this.renderer.listen(this.videoPreviewElement.nativeElement, 'loadedmetadata', () => {
        this.videoDuration = this.videoPreviewElement.nativeElement.duration;
      });
      const fileName = this.file.name;
      const fileType = this.file.type;
      try {
        const user: any = await this.tokenStorage.getUser().toPromise()
        const { _id } = JSON.parse(user)
        const url = await this.creatorSpaceService.getUploadURL({ fileName, fileType, Key: _id })
        this.creatorSpaceService.uploadVideo(this.file, url.url)
          .subscribe(async (event: HttpEvent<any>) => {
            switch (event.type) {
              case HttpEventType.UploadProgress:
                this.progress = Math.round(event.loaded / event.total * 100)
                break;
              case HttpEventType.Response:
                try {
                  const video = await this.creatorSpaceService.uploadVideoByUrl({ url: event.url, duration: this.videoDuration, title: this.file.name })
                  if (video) {
                    this.getMyVideos();
                  }
                  this.videoUploaded = true
                  setTimeout(() => {
                    this.progress = 0,
                      this.videoUploaded = false
                  }, 1500)
                } catch (e) {
                  console.log(e)
                }
            }
          })
      } catch (e) {
        console.log(e)
      }
    }
  }

  public selectVideo() {
    this.fileInput.nativeElement.click()
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
      await this.creatorSpaceService.toggleVideoStatus(id, status)
    } catch (e) {
      console.log(e)
    }
  }

  async deleteVideo(id: string) {
    try {
      const state = confirm(`Deleting a video can not be undone. Note that you can always set your videos to private to hide them. Are you sure you want to proceed?`)
      if (state)
        await this.creatorSpaceService.deleteVideo(id)
        this.getMyVideos();
    } catch (e) {
      console.log(e)
    }
  }

  async downloadVideo(id: string) {
    // TODO: add download code
  }

  toggleView() {
    this.video = null;
  }

  async getMyVideos() {
    const user: any = await this.tokenStorage.getUser().toPromise();
      const { _id } = JSON.parse(user);
      this.videos = await this.creatorSpaceService.getUserVideos(_id);
      this.ngOnInit()
      this.videosEvent.emit();
  }

  async ngOnInit() {
    await this.videos.forEach((video: any) => {
      video.totalViews = video.views.length ? video.views.map(view => view.viewCounter).reduce((a, b) => a + b) : 0
      video.totalRate = Math.round((video.likes.filter(like => like.status).length / video.likes.length) * 100)
    });
    this.dataSource = new MatTableDataSource(this.videos);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
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
