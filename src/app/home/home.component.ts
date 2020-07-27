import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChatService } from '../services/chat.service'
import { AuthService } from "../auth/auth.service";
import { TokenStorage } from '../auth/token.storage'
import { FriendService } from '../services/friend.service'
import { FriendChatService } from '../services/friendchat.service'
import { Socket } from '../services/socket.service'
import { SwPush } from '@angular/service-worker'
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingDialogComponent } from './../controls/loading-dialog/loading-dialog.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  public dialogRef: MatDialogRef<LoadingDialogComponent>
  @HostListener('window:scroll', ['$event'])
  readonly VAPID_PUBLIC_KEY = "BCAHVGlRZxDTLfMNDB4H6J9VrDwovTMaJe1d9PPD648Hc0_eP8og9hLHp8dCKdnjhOz3h3sS6MoUXd8rrX60Nvw"
  public skip: number = 1000000
  public limit: number = 1000000

  public skipFriends: number = 10
  public limitFriends: number = 10

  public messageCount: any = 0;
  public notificationCounts: any;
  public isConnected: boolean
  public friendList
  private subscriber: Subscription

  constructor(
    public http: HttpClient,
    private authService: AuthService,
    public chatService: ChatService,
    private tokenStorage: TokenStorage,
    private swPush: SwPush,
    private _router: Router,
    private _socket: Socket,
    public dialog: MatDialog,
    private _activatedRoute: ActivatedRoute,
    private friendsService: FriendService,
    private friendChatService: FriendChatService,
  ) {
    this._socket.listenToFriendMessage().subscribe(request => {
      this.messageCount = (this.messageCount ? this.messageCount : 0) + 1
      this.getTotalUnreadNotificationsCount()
    })
  }

  public getTotalUnreadNotificationsCount() {
    const unreadMessages = this.messageCount
    const unacceptedFriendInvites = this.friendsService.recievedRequests.length
    const totalUnreadNotifications = unreadMessages + unacceptedFriendInvites;
    this.notificationCounts = totalUnreadNotifications > 0 ? totalUnreadNotifications : 0
  }

  onScroll(e) {
    const { scrollHeight, scrollTop, clientHeight } = e.srcElement
    if (scrollHeight - clientHeight <= scrollTop) {
      this.chatService.loadMoreChannels(this.skip, this.limit)
      this.skip += this.limit
    }
  }

  onScrollFriends(e) {
    const { scrollHeight, scrollTop, clientHeight } = e.srcElement
    if (scrollHeight - clientHeight <= scrollTop) {
      this.friendsService.loadMoreFriends(this.skipFriends, this.limitFriends)
      this.skipFriends += this.limitFriends
    }
  }

  async ngOnInit() {
    try {
      this.openDialog()
      const me = await this.authService.me()
      if (!me) {
        this._router.navigate(['/auth/login'])
      } else {
        const user: any = await this.tokenStorage.getUser().toPromise()
        const { firstName } = JSON.parse(user)

        this.subscriber = this.chatService.channelJoinedEmmiter.subscribe(async data => {
          this.friendList = await this.friendsService.getFriendList()
        })

        if (!this.chatService.chatClient) {
          const token = await this.chatService.generateToken(firstName)
          const connection = await this.chatService.connect(token)
          this.chatService.chatConnectedEmitter.subscribe(async (data: Boolean) => {
            await this.connectToChannel(firstName)
          })
        } else {
          await this.connectToChannel(firstName)
        }
      }
    } catch (e) {
      this.closeDialog()
    }
  }

  connectToChannel(firstName: string) {
    return new Promise(async (resolve, reject) => {
      this._activatedRoute.params.subscribe(async ({ channelId }) => {
        try {
          if (this.chatService.currentChannel)
            await this.chatService.leaveChannel(firstName, true, false)

          const getChannel = await this.chatService.getChannel(channelId)
          if (getChannel instanceof Error) 
            throw getChannel

          const joiningChannel = await this.chatService.enterChannel(channelId, firstName)
          const unreadMessages = await this.friendChatService.getUnreadMessageCount()

          unreadMessages.map(m => {
            this.messageCount = this.messageCount + m.count
          })
          this.getTotalUnreadNotificationsCount()
          this.isConnected = true
          this.closeDialog()
          resolve(joiningChannel)
        } catch (e) {
          console.log(e)
          reject(e)
          this._router.navigate(['/404'])
        }
      })
    })
  }

  openDialog() {
    this.dialogRef = this.dialog.open(LoadingDialogComponent, {
      width: '300px',
      data: {
        message: 'Joining Channel...',
      }
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  async ngOnDestroy() {
    const user: any = await this.tokenStorage.getUser().toPromise()
    const { firstName } = JSON.parse(user)

    console.log('>> currentCHannel', this.chatService.currentChannel)

    if (this.chatService.currentChannel && this.chatService.currentChannel.createdBy != firstName)
      this.chatService.leaveChannel(firstName, true, false)

    this.subscriber.unsubscribe()
  }
}
