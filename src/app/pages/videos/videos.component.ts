import { Component, OnInit, HostListener, ViewChild, ElementRef, Renderer2, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { VideoService } from '../../services/video.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { ChatService } from '../../services/chat.service';
import { TokenStorage } from '../../auth/token.storage';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { PaymentService } from '../../services/payment.service';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss']
})
export class VideosComponent implements OnInit {
  @Input() videos: any = [];
  @ViewChild('videoPreview', { static: false }) videoPreviewElement: ElementRef;
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;
  @ViewChild('videothumbnail', { static: false }) videoThumbnail: ElementRef;
  @HostListener('window:scroll', ['$event'])
  public searchTitle: string;
  public limit: number = 1000000;
  public skip: number = 1000000;
  // public videos: any = [];
  public file: File
  public thumbnail: File
  public progress: number = 0;
  public videoURL: any;
  public videoDuration: number;
  public videoUploaded: boolean = false;
  public username: string;
  public isOwner: boolean = false;
  public channelSID: string;

  constructor(
    public router: Router,
    public chatService: ChatService,
    public tokenStorage: TokenStorage,
    public videoService: VideoService,
    private paymentService: PaymentService,
    public sanitizer: DomSanitizer,
    private renderer: Renderer2,
    public dialog: MatDialog,
  ) { }

  async ngOnInit() {
    try {
      this.videos = await this.videoService.getVideosData({ limit: this.limit, skip: this.skip });
    } catch (e) {
      console.log(e)
    }
  }

  public searchedVideos = []
  async searchVideos() {
    try {
      if (!this.searchTitle) {
        this.searchedVideos = []
      } else {
        const videos = await this.videoService.getVideosData({ limit: 0, skip: 0, query: { name: this.searchTitle } })
        this.searchedVideos = videos.videos
      }
    } catch (e) {
      console.log(e)
    }
  }

  onScroll(e) {
    const { scrollHeight, scrollTop, clientHeight } = e.srcElement;
    if (scrollHeight - clientHeight <= scrollTop) {
      this.loadMore();
    }
  }

  async loadMore() {
    this.skip = this.videos.videos.length
    const videos = await this.videoService.getVideosData({ limit: this.limit, skip: this.skip })
    this.videos.videos = [
      ...this.videos.videos,
      ...videos.videos.map(video => video)
    ]
  }

  public selectVideo() {
    this.fileInput.nativeElement.click()
  }

  public async uploadVideo($event) {
    if ($event.target.files.length > 0) {
      this.file = $event.target.files[0];
      this.videoURL = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(this.file));
      this.renderer.listen(this.videoPreviewElement.nativeElement, 'loadedmetadata', () => {
        this.videoDuration = this.videoPreviewElement.nativeElement.duration;
        const rand = Math.round(Math.random() * this.videoDuration * 1000) + 1
        this.videoPreviewElement.nativeElement.currentTime = rand
      });

      this.renderer.listen(this.videoPreviewElement.nativeElement, 'seeked', () => {
        const context = this.videoThumbnail.nativeElement.getContext('2d')
        const { width, height } = this.videoThumbnail.nativeElement
        context.drawImage(this.videoPreviewElement.nativeElement, 0, 0, width, height)
        const imgUnit8 = this.videoThumbnail.nativeElement.toDataURL('image/png')
        const imgBlob = this.dataURItoBlob(imgUnit8)
        console.log($event.target.files[0].name.substr(0, $event.target.files[0].name.lastIndexOf('.')) + '.png')
        this.thumbnail = this.blobToFile(imgBlob, $event.target.files[0].name.substr(0, $event.target.files[0].name.lastIndexOf('.')) + '.png')
        console.log(this.thumbnail)
      });

      try {
        const user: any = await this.tokenStorage.getUser().toPromise();
        const { _id } = JSON.parse(user)
        const videoUpload = await this.videoService.getUploadURL({ fileName: this.file.name, fileType: this.file.type, Key: _id })
        this.videoService.uploadVideo(this.file, videoUpload.url)
          .subscribe(async (event: HttpEvent<any>) => {
            switch (event.type) {
              case HttpEventType.UploadProgress:
                this.progress = Math.round(event.loaded / event.total * 100);
                break;
              case HttpEventType.Response:
                try {
                  const thumbnailUpload = await this.videoService.getUploadURL({ fileName: this.thumbnail.name, fileType: this.thumbnail.type, Key: _id })
                  this.videoService.uploadVideo(this.thumbnail, thumbnailUpload.url)
                    .subscribe(async ($event: HttpEvent<any>) => {
                      switch ($event.type) {
                        case HttpEventType.Response:
                          try {
                            const video = await this.videoService.uploadVideoByUrl({
                              url: event.url,
                              duration: this.videoDuration,
                              title: this.file.name.substr(0, this.file.name.lastIndexOf('.')),
                              thumbnail: { Location: $event.url.substr(0, $event.url.indexOf('?')) }
                            })
                            this.ngOnInit()
                            this.videoUploaded = true
                            setTimeout(() => {
                              this.progress = 0
                              this.videoUploaded = false
                              this.file = null
                              this.thumbnail = null
                              this.fileInput.nativeElement.value = ''
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
          })
      } catch (e) {
        console.log(e)
      }
    } else {
      console.log('Error----------------')
    }
  }

  public dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(',')[1])
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
    const ab = new ArrayBuffer(byteString.length)
    const ia = new Uint8Array(ab)
    for (var i = 0; i < byteString.length; i++)
      ia[i] = byteString.charCodeAt(i)

    return new Blob([ab], { type: mimeString })
  }

  public blobToFile = (theBlob: Blob, fileName: string): File => {
    const file = new File([theBlob], fileName)
    return file
  }

  navigateToCreatorSpace() {
    this.router.navigate(['/creator-space/videos'])
  }

  showMoreOptions() {

  }

  showOptionsDialog() {

  }
}
