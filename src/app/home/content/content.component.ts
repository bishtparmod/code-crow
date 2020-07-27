import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ChatService } from '../../services/chat.service'
import { FriendChatService } from '../../services/friendchat.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {
  @Output() sidenavClose = new EventEmitter();
  public streamingStatus: string

  constructor(
    public chatService: ChatService,
    public friendChatService: FriendChatService
  ) {
  }

  async ngOnInit() {
  }

  async ngAfterViewInit() {
  }

  public onSidenavClose = () => {
    this.sidenavClose.emit();
  }

  // getStreamingStatus() {
  //   if (this.chatService.isStreamInitialized && this.chatService.isHost) {
  //     if (this.chatService.isScreenSharing) {
  //       this.chatService.isStreamingMsgBackgroundOn = true
  //       return this.streamingStatus = "Streaming in progress" // Streaming is in progress
  //     } else {
  //       this.chatService.isStreamingMsgBackgroundOn = false
  //       return this.streamingStatus = "Streaming stopped" // Streaming stopped
  //     }
  //   } else if (!this.chatService.isHost) {
  //     if (!this.chatService.sharedScreen) {
  //       this.chatService.isStreamingMsgBackgroundOn = false
  //       return this.streamingStatus = "Host is not streaming yet" // Host is not streaming
  //     } else {
  //       this.chatService.isStreamingMsgBackgroundOn = false
  //       return "" // Host is streaming, show video
  //     }
  //   }
  // }
}
