import { Component, OnInit, OnDestroy } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { AddChannelComponent } from "../../home/channel/add-channel/add-channel.component";
import { ChatService } from "../../services/chat.service";
import { Socket } from "../../services/socket.service";
import { FriendService } from '../../services/friend.service'
import { FriendChatService } from '../../services/friendchat.service'
import "rxjs/add/observable/fromEvent";
import "rxjs/Rx";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.scss']
})
export class ChannelsComponent implements OnInit, OnDestroy {

  public channelId: string;
  public searchTitle: string;
  public showingFriends: boolean = false
  public showingChannels: boolean = false
  public channel = []
  public friendList
  public subscriber: Subscription

  constructor(
    public dialog: MatDialog,
    public chatService: ChatService,
    private _socket: Socket,
    public friendService: FriendService,
    public friendChatService: FriendChatService
  ) {
  }

  searchChannels() {
    console.log(this.searchTitle)
  }

  ngOnInit() {
    if (this.chatService.allChannels.length) {
      this.showingChannels = true
    } else {
      this.subscriber = this.chatService.channelsLoadedEmmiter.subscribe(async data => {
        this._socket.listenChannelAdded().subscribe(_ => {
          this.chatService.getChannels()
        })
        this._socket.listenChannelRemoved().subscribe(_ => {
          this.chatService.getChannels()
        })
        this.showingChannels = true
      })
    }
  }

  ngOnDestroy() {
    if (this.subscriber) 
      this.subscriber.unsubscribe()
  }

  showAddChannelDialog(): void {
    this.dialog.open(AddChannelComponent, {
      width: "400px",
      data: {
        title: "",
        description: ""
      }
    })
  }

}
