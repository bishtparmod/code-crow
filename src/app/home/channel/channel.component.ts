import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { AddChannelComponent } from "./add-channel/add-channel.component";
import { ChatService } from "../../services/chat.service";
import { Socket } from "../../services/socket.service";
import "rxjs/add/observable/fromEvent";
import "rxjs/Rx";

@Component({
  selector: "app-channel",
  templateUrl: "./channel.component.html",
  styleUrls: ["./channel.component.scss"]
})
export class ChannelComponent implements OnInit {
  public channelId: string;
  public searchTitle: string;
  public showingFriends: boolean = false
  public showingChannels: boolean = true
  public channel = []
  constructor(
    public dialog: MatDialog,
    public chatService: ChatService,
    private _socket: Socket
  ) {
  }

  searchChannels() {
    console.log(this.searchTitle)
  }

  async ngOnInit() {
    this._socket.listenChannelAdded().subscribe(_ => {
      this.chatService.getChannels()
    })
    this._socket.listenChannelRemoved().subscribe(_ => {
      this.chatService.getChannels()
    })
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
