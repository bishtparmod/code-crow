import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ChatService } from '../../../services/chat.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { LocalVideoTrack, LocalAudioTrack } from 'twilio-video'
import { TokenStorage } from '../../../auth/token.storage';

@Component({
  selector: 'app-stream',
  templateUrl: './stream.component.html',
  styleUrls: ['./stream.component.scss']
})
export class StreamComponent implements OnInit {
  @ViewChild('videoPreview', { static: false }) videoPreviewElement: ElementRef;
  @ViewChild('audioPreview', { static: false }) audioPreviewElement: ElementRef;

  private videoTrack: LocalVideoTrack;
  private audioTrack: LocalAudioTrack;
  private localTracks: any
  public isInitializing: boolean = true;
  public streamForm: FormGroup
  public username: string
  public channelSID: string

  constructor(
    private readonly renderer: Renderer2,
    private fb: FormBuilder,
    public chatService: ChatService,
    private tokenStorage: TokenStorage,
    private dialogRef: MatDialogRef<StreamComponent>,
  ) {
    this.streamForm = this.fb.group({
      title: [null, Validators.required]
    })
  }

  async ngOnInit() {
    const activeUser: any = await this.tokenStorage.getUser().toPromise()
    const activeUserUsername = JSON.parse(activeUser).firstName
    this.username = activeUserUsername

    const channelId = this.chatService.currentChannel.sid
    this.channelSID = channelId
    if (this.channelSID) {
      this.init()
    }
  }

  async init() {
    if (this.videoPreviewElement && this.videoPreviewElement.nativeElement) {
      const hostLocalVideoTrack = this.chatService.hostLocalVideoTrack
      await this.initializeDevice('videoinput', hostLocalVideoTrack);
    }
  }

  public async shareToTwillio() {
    if (this.streamForm.valid) {
      const screenTrack = [this.videoTrack]
      if(this.audioTrack) {
        screenTrack.push(this.audioTrack)
      }
      const { title } = this.streamForm.value
      const twilioRes = await this.chatService.connectToVideoRoom(this.channelSID, title, screenTrack)
      if (twilioRes.room)
        this.dialogRef.close()
    }
  }

  public error: string
  public isLoading = false
  public async getFromTwillio() {
    this.isLoading = true
    const twilioRes = await this.chatService.connectToVideoRoom(this.channelSID)
    const { room, share, videoTrack, error } = twilioRes
    if (videoTrack) {
      this.error = ''
      this.isLoading = false
      this.dialogRef.close()
    }
    if (error) {
      this.isLoading = false
      this.error = error
    }
    if (room) {
      this.isLoading = false
    }
    setTimeout(() => {
      console.log('>> ROOM PARTICIPANTS FROM SETTINGS', this.chatService.roomParticipants)
    }, 1000)
  }

  private async initializeDevice(kind?: MediaDeviceKind, screenTrack?) {
    try {
      this.isInitializing = true;
      this.finalizePreview();

      if (screenTrack) {
        this.videoTrack = screenTrack as LocalVideoTrack;
        const videoElement = (this.videoTrack as LocalVideoTrack).attach();
        this.renderer.setStyle(videoElement, 'height', '100%');
        this.renderer.setStyle(videoElement, 'width', '100%');
        this.renderer.appendChild(this.videoPreviewElement.nativeElement, videoElement);
      } else {
        console.log('>> GETTING USER SCREEN')
        this.localTracks = await this.chatService.getUserScreen()
        const { audioTrack, screenTrack } = this.localTracks
        this.videoTrack = screenTrack as LocalVideoTrack;
        this.audioTrack = audioTrack as LocalAudioTrack;

        const videoElement = (this.videoTrack as LocalVideoTrack).attach();
        const audioElement = this.audioTrack.attach();
        this.renderer.setStyle(videoElement, 'height', '100%');
        this.renderer.setStyle(videoElement, 'width', '100%');
        this.renderer.appendChild(this.videoPreviewElement.nativeElement, videoElement);
        this.renderer.appendChild(this.audioPreviewElement.nativeElement, audioElement);
      }
    } finally {
      this.isInitializing = false;
    }
  }

  finalizePreview() {
    try {
      if (this.videoTrack) {
        this.videoTrack.detach().forEach(element => element.remove());
      }
    } catch (e) {
      console.error(e);
    }
  }

}
