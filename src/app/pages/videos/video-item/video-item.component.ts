import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router'
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-video-item',
  templateUrl: './video-item.component.html',
  styleUrls: ['./video-item.component.scss']
})
export class VideoItemComponent implements OnInit {
  @Input() video: any;
  public isCurrentVideo: boolean
  public views: number
  public likes: number
  public sort_option: string
  public showOptionsDialog: boolean

  constructor(
    public dialog: MatDialog,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.views = this.video.length ? this.video.views.map(view => view.viewCounter).reduce((a, b) => a + b) : 0
    this.likes = this.video.likes ? Math.round((this.video.likes.filter(like => like.status).length / this.video.likes.length) * 100) : 0
  }

  playVideo(videoId: string) {
    this.router.navigate([`/video/${videoId}`])
  }

  toHHMMSS = (duration) => {
    let sec_num: any = parseInt(duration, 10)
    let hours: any = Math.floor(sec_num / 3600)
    let minutes: any = Math.floor((sec_num - (hours * 3600)) / 60)
    let seconds: any = sec_num - (hours * 3600) - (minutes * 60)

    let hourSeparator = ':'
    let minuteSeparator = ':'

    if (hours == 0) { hours = ''; hourSeparator = ''; }
    if (minutes < 10 && hours != 0) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }
    let time = hours + hourSeparator + minutes + minuteSeparator + seconds;
    return time;
  }

  showMoreOptions() {
    this.showOptionsDialog = !this.showOptionsDialog
  }
}