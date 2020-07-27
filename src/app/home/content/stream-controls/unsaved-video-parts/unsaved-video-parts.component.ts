import { Component, OnInit, Inject, ViewChild } from '@angular/core'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { ChatService } from '../../../../services/chat.service'
import { MatSort } from '@angular/material/sort'
import { MatTableDataSource } from '@angular/material/table'
import { MatPaginator } from '@angular/material/paginator'
import * as moment from 'moment'
import { VideoService } from '../../../../services/video.service'
import { Socket } from '../../../../services/socket.service'
import { VgAPI } from 'videogular2/compiled/core'


@Component({
  selector: 'app-unsaved-video-parts',
  templateUrl: './unsaved-video-parts.component.html',
  styleUrls: ['./unsaved-video-parts.component.scss']
})
export class UnsavedVideoPartsComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator
  @ViewChild(MatSort, { static: true }) sort: MatSort
  displayedColumns: string[] = ['channel', 'title', 'duration', 'size', 'createdAt', 'deleteDate', 'actions']
  dataSource: MatTableDataSource<any>
  playingVideoPart = null
  videoPartUrl: String = null

  constructor(
    public chatService: ChatService,
    public videoService: VideoService,
    public dialogRef: MatDialogRef<UnsavedVideoPartsComponent>,
    private _socket: Socket,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  stopVideoPart() {
    this.playingVideoPart = false
    this.videoPartUrl = null
  }

  async ngOnInit() {
    const self = this
    const previousVideoParts = await this.videoService.getUnsavedStreams()
    this.dataSource = new MatTableDataSource(
      previousVideoParts.map(videoPart => ({
        ...videoPart,
        size: Math.round(videoPart.size * 100) / 100,
        deleteIn: moment(videoPart.deleteDate).diff(moment(), 'days'),
        download: function () {
          window.open(`${location.origin}/api/video-parts/${this.ssid}/download`)
        },
        upload: function () {
          // self._socket.emitProcessVideoPart(this.ssid)
          self._socket.emitStartUpload(this.ssid)
          this.isUploading = true
          self._socket.uploadfinishedListner(this.ssid).subscribe(data => {
            this.isUploading = false
            this.isUploaded = true
          })
        },
        process: function () {
          self._socket.emitProcessVideoPart(this.ssid)
          this.isProcessing = true
          self._socket.videoPartProcessedListner(this.ssid).subscribe(data => {
            const { duration, size } = data
            this.duration = duration
            this.size = size
            this.isProcessing = false
          })
        },
        editName: async function ($e) {
          try {
            const { innerText } = $e.srcElement
            if (!this.isUploading && !this.isUploaded && !this.isInprogress && !this.isProcessing && innerText != this.name) {
              this.isProcessing = true
              await self.videoService.updateVideoPart({ id: this._id, name: innerText })
              this.name = innerText
            }
          } catch (e) {
            this.error = e.error.message
            this.isProcessing = false
            $e.srcElement.innerText = this.name
            setTimeout(() => {
              this.error = null
            }, 2000)
            console.log(e)
          }
        },
        delete: async function () {
          try {
            await self.videoService.deleteVideoPart({ ssid: this.ssid })
            self.ngOnInit()
          } catch (e) {
            console.log(e)
          }
        },
        play: async function () {
          self.videoPartUrl = self.videoService.playVideoPart({ ssid: this.ssid })
          self.playingVideoPart = this
        }
      }))
    )
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
    this.dataSource.filter = filterValue.trim().toLowerCase()

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage()
    }
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

}
