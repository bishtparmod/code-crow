import { Component, OnInit, Input } from '@angular/core';
import { FriendService } from '../../../services/friend.service';
import { FriendChatService } from '../../../services/friendchat.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-friend-item',
  templateUrl: './friend-item.component.html',
  styleUrls: ['./friend-item.component.scss']
})
export class FriendItemComponent implements OnInit {

  @Input() friend: any;
  public lastMessage: string;
  public unSeenMessagesCount = 0
  constructor(
    private router: Router,
    private friendService: FriendService,
    private friendChatService: FriendChatService
  ) {
  }

  ngOnInit() {
    if (!this.friend.user)
      this.friend.user = {}
    if (this.friend.messages) {
      this.unSeenMessagesCount = this.friend.messages.length - this.friend.lastSeenMessageIndex - 1
      this.truncateLastMessage(32)
    }
    if (this.friend.onConnect && this.friend.onDisconnect) {
      this.friend.onConnect().subscribe(friend => {
        this.friend.user.isOnline = true
        this.friendService.friendOnlineNotification(friend)
      })
      this.friend.onDisconnect().subscribe(friend => {
        this.friend.user.isOnline = false
      })
    }
  }

  truncateLastMessage(maxSize: number) {
    if (this.friend.messages && this.friend.messages.length > 0) {
      var message = this.friend.messages[this.friend.messages.length - 1].body
      this.lastMessage = (message.length > maxSize) ? message.substr(0, maxSize - 1) + '...' : message;
    }
  }

  async openFriendChat() {
    if (this.friend.status == 3) {
      // await this.friendService.updateSeenIndex({ lastSeenMessageIndex: this.friend.channel.lastMessage.index, recipient: this.friend.user._id })
      this.unSeenMessagesCount = 0
      this.friendChatService.activateChatTab(this.friend)
    }
  }
}