import { Component, OnInit, Input } from '@angular/core'
import { DomSanitizer } from '@angular/platform-browser'

@Component({
  selector: 'app-video-part-item',
  templateUrl: './video-part-item.component.html',
  styleUrls: ['./video-part-item.component.scss']
})
export class VideoPartItemComponent implements OnInit {
  @Input() videoPart: any
  @Input() i: number

  constructor(
    private sanitizer: DomSanitizer
  ) {
  }

  ngOnInit() {
    console.log('this.videoPart', this.videoPart)
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
  
  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

}
