import { Component, ElementRef, ViewChild, AfterViewInit, Renderer2, OnInit } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { createLocalTracks, LocalTrack, LocalVideoTrack, LocalAudioTrack } from 'twilio-video'
import { StorageService } from '../../../services/storage.service';
import { ResizeEvent } from 'angular-resizable-element';
import { ChatService } from '../../../services/chat.service';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit {

  @ViewChild('videoPreview', { static: true }) videoElement: ElementRef;
  @ViewChild('audioPreview', { static: true }) audioElement: ElementRef;

  public style: object = {};
  hasFullscreenSupport: boolean = false
  isFullscreen: boolean;

  ngOnDestroy() {
    if (this.hasFullscreenSupport) {
      this.videoElement.nativeElement.removeEventListener('fullscreenchange');
    }
  }

  onResizeEnd(event: ResizeEvent): void {
    this.style = {
      position: 'fixed',
      left: `${event.rectangle.left}px`,
      top: `${event.rectangle.top}px`,
      width: `${event.rectangle.width}px`,
      height: `${event.rectangle.height}px`
    };
  }

  get tracks(): LocalTrack[] {
    return this.localTracks;
  }

  isInitializing: boolean = true;

  private videoTrack: LocalVideoTrack;
  private audioTrack: LocalAudioTrack;
  private localTracks: LocalTrack[] = [];
  public showRate: Boolean = false
  public rateForm: FormGroup
  public isHover: boolean;

  constructor(
    private readonly renderer: Renderer2,
    private readonly storageService: StorageService,
    public chatService: ChatService,
    private fb: FormBuilder
  ) {
    this.rateForm = this.fb.group({
      rate: [null, Validators.required]
    })
    this.isHover = false;
    if (this.hasFullscreenSupport) {
      this.videoElement.nativeElement.addEventListener('fullscreenchange', () => {
        this.isFullscreen = (this.videoElement.nativeElement.fullscreenElement !== null);
      }, false);
    }
  }

  async ngAfterViewInit() {
    if (this.videoElement && this.videoElement.nativeElement) {
      const videoTrack = this.chatService.sharedScreen
      const audioTrack = this.chatService.sharedAudio
      this.initializeTrack(videoTrack, audioTrack)
    }
  }

  ngOnInit() {
    // setTimeout(() => {
    //   this.showRate = true
    // }, 5000)
  }

  public rate() {
    if (this.rateForm.valid) {
      const { rate } = this.rateForm.value
      this.chatService.rateStreamAPI(rate)
        .then(res => {
          this.showRate = false
        })
    }
  }

  toggleFullscreen() {
    const element = this.videoElement.nativeElement;
    element.requestFullscreen();

    // if (this.hasFullscreenSupport && !this.isFullscreen) {
    //   const elem = document.body;
    //   this.videoElement.nativeElement.requestFullscreen(elem);
    // } else {
    //   this.videoElement.nativeElement.exitFullscreen();
    // }
  }

  public later() {
    this.showRate = false
    setTimeout(() => {
      this.showRate = true
    }, 10000)
  }

  private async initializeTrack(videoTrack, audioTrack) {
    try {
      console.log('>> JOINING LIVE STREAM')
      this.isInitializing = true;
      this.videoTrack = videoTrack as LocalVideoTrack
      this.audioTrack = audioTrack as LocalAudioTrack
      // console.log(this.videoTrack.track)
      const videoElement = this.videoTrack.track.attach()
      if (this.audioTrack && this.audioTrack.track) {
        const audioElement = this.audioTrack.track.attach()
        this.renderer.appendChild(this.audioElement.nativeElement, audioElement)
      }

      this.renderer.setStyle(videoElement, 'height', 'auto')
      this.renderer.setStyle(videoElement, 'width', '100%')

      this.renderer.appendChild(this.videoElement.nativeElement, videoElement)

    } finally {
      this.isInitializing = false;
    }
  }

}
