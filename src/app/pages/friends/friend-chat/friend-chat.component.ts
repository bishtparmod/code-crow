import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { FriendChatService } from '../../../services/friendchat.service';
import { TokenStorage } from '../../../auth/token.storage';
import { Socket } from '../../../services/socket.service';
import { ChatService } from "../../../services/chat.service";

@Component({
  selector: 'app-friend-chat',
  templateUrl: './friend-chat.component.html',
  styleUrls: ['./friend-chat.component.scss']
})
export class FriendChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('chatDisplay', { static: false }) chatDisplay: ElementRef;

  isMinimized: boolean;
  @Input() friend: any;
  public message: string
  public username
  public givenEmoji: any
  public receviedImage: any
  public appInputRefresh: boolean = false
  public givenGifImage: any
  public attribute: any
  public hidedata: boolean = false
  private hasScrolledBottom = false

  constructor(
    private _socket: Socket,
    public friendChatService: FriendChatService,
    public chatService: ChatService,
    public tokenStorage: TokenStorage
  ) { }

  async ngOnInit() {
    try {
      if (this.friend.onConnect && this.friend.onDisconnect) {
        this.friend.onConnect().subscribe(friend => {
          this.friend.user.isOnline = true
        })
        this.friend.onDisconnect().subscribe(friend => {
          this.friend.user.isOnline = false
        })
      }

      const user: any = await this.tokenStorage.getUser().toPromise()
      this.username = JSON.parse(user).firstName
      if (this.username && this.friend.channel) {
        this.friend.channel.on('messageAdded', (m) => {
          setTimeout(() => {
            const el = this.chatDisplay.nativeElement
            el.scrollTop = el.scrollHeight
          })
        })
      }
    } catch (e) {
      console.log(e)
    }
  }

  ngAfterViewChecked() {
    if (this.chatDisplay && !this.hasScrolledBottom) {
      const el = this.chatDisplay.nativeElement;
      el.scrollTop = el.scrollHeight;
      this.hasScrolledBottom = true
    }
  }

  ngDoCheck() {
    if (this.givenEmoji && this.appInputRefresh) {
      this.message = this.givenEmoji
      this.appInputRefresh = false
    }

    if (this.givenGifImage && this.appInputRefresh) {
      this.attribute = this.givenGifImage
      this.appInputRefresh = false
      this.sendMessage()
    }
  }

  emitTyping($event) {
    const { keyCode } = $event
    if (keyCode == 13 && !$event.shiftKey) {
      keyCode.preventDefault();
    } else {
      this.chatService.currentChannel.typing()
    }
  }

  async sendMessage() {
    const $user: any = await this.tokenStorage.getUser().toPromise();
    const user = JSON.parse($user);
    if (this.receviedImage) {
      const data = await this.chatService.postFile(this.receviedImage)
      this.attribute = {
        avatar: user.avatar,
        email: user.email,
        text: data.name,
        file: data.location,
        type: data.type
      }
    }
    if (this.message) {
      this.attribute = {
        avatar: user.avatar,
        email: user.email
      }
    }

    var message, attribute
    message = this.message ? this.message : ""
    attribute = this.attribute ? this.attribute : {}
    if (this.friend.channel && (message || this.givenGifImage || this.receviedImage)) {
      this.friend.channel.sendMessage(message, attribute);
      this.message = ""
      this.attribute = {}
      this.receviedImage = ""
      this.givenEmoji = ""
      this.givenGifImage = ""
      this.hidedata = true

      const user: any = await this.tokenStorage.getUser().toPromise();
      await this.friendChatService.setUnreadMessageCount(1, this.friend.recipient, JSON.parse(user)._id);
      this._socket.socket.emit('friend-message-sent', { recipient: this.friend.recipient, requester: JSON.parse(user) })
    }
  }

  closeChat() {
    this.friendChatService.activeTabs = this.friendChatService.activeTabs
      .filter(friend => !!(friend.user._id != this.friend.user._id))
  }
}
