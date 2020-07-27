import { Injectable, EventEmitter } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { FriendsStorage } from '../storage/friends.storage'
import { TokenStorage } from '../auth/token.storage'
import { Socket } from './socket.service'
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar'
import { FriendChatService } from './friendchat.service';
import { get } from 'lodash';
@Injectable({
  providedIn: "root"
})
export class FriendService {

  public fullList = []

  public sentRequests = []
  public recievedRequests = []
  public friendsList = []
  public blockedUsers = []
  public searchResults = []
  public isGettingFriends: Boolean = false
  public friendsLoadedEmmiter: EventEmitter<any> = new EventEmitter<any>()

  constructor(
    private http: HttpClient,
    private friendsStorage: FriendsStorage,
    private tokenStorage: TokenStorage,
    public socket: Socket,
    private _snackBar: MatSnackBar,
    public friendsChatService: FriendChatService
  ) { }

  public searchUsers(param): Promise<any> {
    return this.http.get('/api/users/search', { params: { param } }).toPromise()
  }

  public async sendFriendRequest({ recipient }): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const user: any = await this.tokenStorage.getUser().toPromise()
        await this.http.post('/api/friends/add-friend', { recipient }).toPromise()
        await this.friendsChatService.createFriendsChannel(recipient, JSON.parse(user)._id)
        this.socket.socket.emit('friend-request-sent', { recipient, requester: JSON.parse(user) })
        resolve()
      } catch (e) {
        reject(e)
      }
    })
  }

  public acceptFriendRequest({ requester }): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const user: any = await this.tokenStorage.getUser().toPromise()
        const request = await this.http.patch('/api/friends/accept-request', { requester }).toPromise()
        // this.friendsChatService.joinChannel()
        this.socket.socket.emit('friend-request-accepted', { requester, recipient: JSON.parse(user) })
        resolve()
      } catch (e) {
        reject(e)
      }
    })
  }

  public declineFriendRequest({ requester }): Promise<any> {
    return this.http.patch('/api/friends/decline-request', { requester }).toPromise()
  }

  public getUserById({ id }): Promise<any> {
    return this.http.get(`/api/users/${id}`).toPromise()
  }

  public emailAttempts = []

  public cancelFriendRequest({ recipient }): Promise<any> {
    return this.http.patch('/api/friends/cancel-request', { recipient }).toPromise()
  }

  public blockUser({ recipient }): Promise<any> {
    return this.http.patch('/api/friends/block-user', { recipient }).toPromise()
  }

  public unBlockUser({ recipient }): Promise<any> {
    return this.http.patch('/api/friends/unblock-user', { recipient }).toPromise()
  }

  public updateSeenIndex({ lastSeenMessageIndex, recipient }): Promise<any> {
    return this.http.patch('/api/friends/update-seen-index', { lastSeenMessageIndex, recipient }).toPromise()
  }

  public getFriendList(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const response: any = await this.http.get('/api/friends/').toPromise()
        const user: any = await this.tokenStorage.getUser().toPromise()
        const { email } = JSON.parse(user)
        const friends = response.friends.map(friend => friend.recipient.email == email ?
          {
            status: friend.status,
            user: friend.requester,
            channelSID: friend.channelSID,
            lastSeenMessageIndex: friend.lastSeenMessageIndex
          } :
          {
            status: friend.status,
            user: friend.recipient,
            channelSID: friend.channelSID,
            lastSeenMessageIndex: friend.lastSeenMessageIndex
          })
        this.friendsStorage.saveFriends(friends)
        this._filterFriends(friends)
        await this.prepareFriendsChat()
        return resolve(friends)
      } catch (e) {
        console.log(e)
        return reject(e)
      }
    })
  }

  public fullFriendsList = []

  loadMoreFriends(skip: number, limit: number) {
    if (skip >= this.fullFriendsList.length) return
    this.friendsList = [...this.friendsList, ...this.fullFriendsList.slice(skip, skip + limit)]
  }

  public async prepareFriendsChat() {
    return Promise
      .all(
        this.fullList.filter(friend => !!(friend.status == 3)).map(friend => this.friendsChatService.joinChannel(friend.channelSID, friend.user._id, friend))
      )
      .then(res => {
        this.fullFriendsList = res
        this.friendsList = res
      })
  }

  private _filterFriends(friends) {
    if (friends) {
      this.fullList = friends.map(friend => this.socket.addConnectionEvent(friend))
      this.sentRequests = this.fullList.filter(friend => !!(friend.status == 1))
      this.recievedRequests = this.fullList.filter(friend => !!(friend.status == 2))
      this.blockedUsers = this.fullList.filter(friend => !!(friend.status == 4))
    }
  }

  public friendOnlineNotification(friend) {
    this._snackBar.open(`${friend.user.firstName} is now online.`, null, { duration: 3000 })
  }

  public friendRequestNotification(request) {
    const snackBarRef = this._snackBar.open(`${request.requester.firstName} wants to add you as a friend.`, "Accept", { duration: 5000 })
    snackBarRef.onAction().subscribe(async () => {
      try {
        await this.acceptFriendRequest({ requester: request.requester._id })
        this._snackBar.open(`You and ${request.requester.firstName} are now friends.`, null, { duration: 5000 })
        this.getFriendList()
      } catch (e) {
        console.log(e)
      }
    })
  }

  public friendAddedNotification(request) {
    this._snackBar.open(`${request.recipient.firstName} Accepted your friend request.`, null, { duration: 5000 })
    this.getFriendList()
  }

  public areUsersFriends(userName) {
    return [
      this.friendsList.filter(friend => !!(friend.user.firstName == userName)),
      this.sentRequests.filter(friend => !!(friend.user.firstName == userName)),
      this.recievedRequests.filter(friend => !!(friend.user.firstName == userName)),
      this.blockedUsers.filter(friend => !!(friend.user.firstName == userName))
    ]
  }
}
