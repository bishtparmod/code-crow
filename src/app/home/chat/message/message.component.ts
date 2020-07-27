import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ChatService } from '../../../services/chat.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DonateDialogComponent } from '../donate-dialog/donate-dialog.component';
import { Message } from 'twilio-chat/lib/message';
import { TokenStorage } from '../../../auth/token.storage'
import { FriendService } from '../../../services/friend.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FriendChatService } from '../../../services/friendchat.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {
  @Input() Sender: string;
  @Input() When: string;
  @Input() Content: string;
  @Input() Avatar: string;
  @Input() Username: string;
  @Input() MemberSid: string;
  @Input() Message: Message;
  @Input() oneVone: Number
  @Input() Email: string;
  @Input() Image: string;
  @Input() File: string;
  @Input() MimeType: string;
  @Input() FileName: string;
  @Input() wasPreviousMsg: boolean = false

  public isHover: boolean;
  @Output() sidenavClose = new EventEmitter();

  public isMyMessage: boolean
  public isOwnerMessage: boolean
  public areUsersFriends: boolean
  public friend

  constructor(
    public chatService: ChatService,
    public dialog: MatDialog,
    private tokenStorage: TokenStorage,
    private friendService: FriendService,
    private friendChatService: FriendChatService,
    private _snackBar: MatSnackBar
  ) {
    this.isHover = false;
  }

  async ngOnInit() {
    try {
      if (!this.oneVone) {
        const user: any = await this.tokenStorage.getUser().toPromise()
        const { firstName } = JSON.parse(user)
        this.isMyMessage = !!(firstName == this.Sender)
        this.isOwnerMessage = !!(this.chatService.currentChannel.createdBy == this.Sender)
        const areFriends = this.friendService.areUsersFriends(this.Sender)
        const friend = [].concat.apply([], areFriends)
        this.friend = friend[0] || null
        this.areUsersFriends = friend.length ? true : false
      }
    } catch (e) {
      console.log(e)
    }
  }

  public onSidenavClose = () => {
    this.sidenavClose.emit();
  }

  showDonateDialog() {
    this.onSidenavClose()
    const { sid, createdBy, friendlyName } = this.chatService.currentChannel
    this.dialog.open(DonateDialogComponent, {
      width: '400px',
      data: {
        sid,
        user: createdBy,
        title: friendlyName
      }
    });
  }

  async sendFriendRequest() {
    try {
      console.log(this.friend)
      const request = await this.friendService.sendFriendRequest({ recipient: this.friend._id })
      this._snackBar.open(`Friend request sent to ${this.Sender}`, null, { duration: 5000 })
      console.log(request)
    } catch (e) {
      console.log(e)
    }
  }

  async blockUser() {
    try {
      const request = await this.friendService.blockUser({ recipient: this.friend._id })
      this._snackBar.open(`You've blocked ${this.Sender}`, null, { duration: 5000 })
    } catch (e) {
      console.log(e)
    }
  }

  async deleteMessage() {
    try {
      await this.chatService.deleteMessage(this.Message)
    } catch (e) {
      console.log(e)
    }
  }

  async openFriendChat() {
    console.log(this.friend)
    if (this.friend.status == 3) {
      await this.friendService.updateSeenIndex({ lastSeenMessageIndex: this.friend.channel.lastMessage.index, recipient: this.friend.user._id })
      this.friendChatService.activateChatTab(this.friend)
    }
  }

  async removeFriend() {
    try {
      const request = await this.friendService.cancelFriendRequest({ recipient: this.friend._id })
      this._snackBar.open(`You've removed ${this.Sender} from your friend list.`, null, { duration: 5000 })
    } catch (e) {
      console.log(e)
    }
  }

  async cancelFriendRequest() {
    try {
      const request = await this.friendService.cancelFriendRequest({ recipient: this.friend._id })
      this._snackBar.open(`Friend request to ${this.Sender} has been cancelled.`, null, { duration: 5000 })
    } catch (e) {
      console.log(e)
    }
  }

  async acceptFriendRequest() {
    try {
      const request = await this.friendService.acceptFriendRequest({ requester: this.friend._id })
      this._snackBar.open(`You and ${this.Sender} are now friends.`, null, { duration: 5000 })
    } catch (e) {
      console.log(e)
      this._snackBar.open(`Something went wrong, please try again shortly.`, null, { duration: 5000 })
    }
  }

  async declineFriendRequest() {
    try {
      const request = await this.friendService.declineFriendRequest({ requester: this.friend._id })
      this._snackBar.open(`You've declined a friend request from ${this.Sender}.`, null, { duration: 5000 })
    } catch (e) {
      console.log(e)
      this._snackBar.open(`Something went wrong, please try again shortly.`, null, { duration: 5000 })
    }
  }

  wasPreviousMsgSameSender(): boolean {
    if (!this.wasPreviousMsg) {
      return false
    } else {
      const index = this.chatService.messages.findIndex(x => x.sid === this.Message.sid)
      if (this.chatService.messages.length < 1) {
        return false
      } else if (index === 0) {
        return false
      } else {
        return this.Sender == this.chatService.messages[index - 1].author
      }
    }
  }

}

