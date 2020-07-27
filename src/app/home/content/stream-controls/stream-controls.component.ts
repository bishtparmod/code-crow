import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { MatDialog } from '@angular/material/dialog';
import { ChatService } from '../../../services/chat.service'
import { VideoService } from '../../../services/video.service'
import { TokenStorage } from '../../../auth/token.storage'
import { PaymentService } from '../../../services/payment.service'
import { Socket } from '../../../services/socket.service'
import { DomSanitizer } from '@angular/platform-browser'
import { UnsavedVideoPartsComponent } from './unsaved-video-parts/unsaved-video-parts.component'
import { interval, Subscription } from 'rxjs'

@Component({
  selector: 'app-stream-controls',
  templateUrl: './stream-controls.component.html',
  styleUrls: ['./stream-controls.component.scss']
})
export class StreamControlsComponent implements OnInit {

  public file: File
  public progress: number = 0
  public remainingTime: number
  public streamTimeId: string
  public timer: Subscription
  public videoURL: string
  public videoDuration: number
  public videoUploaded: boolean = false
  public username: string
  public isOwner: boolean = false

  public isInitializing: boolean = true
  public channelSID: string
  public isPayedUser: boolean
  public isLoading: boolean = true

  constructor(
    public chatService: ChatService,
    public tokenStorage: TokenStorage,
    public videoService: VideoService,
    public sanitizer: DomSanitizer,
    private _router: Router,
    private _dialog: MatDialog,
    private paymentService: PaymentService,
    public dialogChannelSettings: MatDialog,
    private _socket: Socket
  ) { }

  async startLiveStream() {
    if (this.isOwner && !this.chatService.videoStreamId) {
      await this.chatService.getUserScreen()
      await this.chatService.shareToTwillio()
      await this.startLiveStreamingDuration()
      this.chatService.setStreamingEvents()
      this.chatService.setAudioEvents()
    } else {
      alert('You must host a channel before starting a live stream.')
    }
  }

  async endLiveStream() {
    if (this.chatService && this.chatService.streamOptions.isLiveStreaming) {
      this.chatService.endLiveStream()
      this.stopLiveStreamingDuration()
    }
  }

  async toggleStream() {
    if (this.chatService && this.chatService.streamOptions.isLiveStreaming) {
      await this.chatService.toggleStream()
      if (this.chatService.streamOptions.videoStream
        && this.chatService.streamOptions.videoStream.isEnabled) {
        this.startLiveStreamingDuration()
      } else {
        this.stopLiveStreamingDuration()
      }
    }
  }

  async startLiveStreamingDuration() {
    this.timer = interval(60000).subscribe(_ => {
      this._socket.emitStreamTimeDecrement(this.streamTimeId)
      this.remainingTime--
      if (this.remainingTime == 0 && this.chatService.streamOptions.videoStream.isEnabled)
        this.toggleStream()
    })
  }

  async stopLiveStreamingDuration() {
    this.timer.unsubscribe()
  }

  async ngOnInit() {
    try {
      const user: any = await this.tokenStorage.getUser().toPromise()
      const { email, firstName, customerId } = JSON.parse(user)
      const customer: any = await this.paymentService.stripeGetCustomer(customerId)
      const streamTime: any = await this.paymentService.getRemainingStreamTime()

      const { data } = customer.subscriptions

      this.isPayedUser = data.length >= 1 ? true : false
      this.remainingTime = streamTime.statistics.totalTimePurchased - streamTime.statistics.totalTimeUsed
      this.streamTimeId = streamTime.streamTime[0]._id
      this.username = firstName

      const previousVideoParts = await this.videoService.getUnsavedStreams()
      if (previousVideoParts.length) {
        this.chatService.streamOptions.hasPreviousVideoParts = true
      }

      this.isOwner = !!(this.username == this.chatService.currentChannel.createdBy)
      if (user)
        this.isLoading = false
    } catch (e) {
      console.log(e)
    }
  }

  ngOnDestroy() {

  }

  convertMinsToHrsMins(mins) {
    let h: any = Math.floor(mins / 60);
    let m: any = mins % 60;
    h = h < 10 ? '0' + h : h;
    m = m < 10 ? '0' + m : m;
    return `${h}:${m}`;
  }

  public viewVideoParts() {
    this._dialog.open(UnsavedVideoPartsComponent, {
      width: '1200px'
    })
  }
}