import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TokenStorage } from '../../../auth/token.storage';
import { ChatService } from '../../../services/chat.service';
import { FriendService } from '../../../services/friend.service';


@Component({
  selector: 'app-channel-settings',
  templateUrl: './channel-settings.component.html',
  styleUrls: ['./channel-settings.component.scss']
})
export class ChannelSettingsComponent implements OnInit {

  public activeUserSearch: string
  public blockedMembers: any = []
  public members: any = []
  public channelAPI: any
  public isLoadingMembers: boolean = true
  public isLoadingBlockedMembers: boolean = true
  public username: string
  public channelSID: string

  constructor(
    private dialogRef: MatDialogRef<ChannelSettingsComponent>,
    public chatService: ChatService,
    private tokenStorage: TokenStorage,
    private friendService: FriendService,
    private snackBar: MatSnackBar
  ) {  }

  async ngOnInit() {
    const userNames = []
    this.chatService.currentChannel.members.forEach(member => { userNames.push(member.state.identity) })
    try {
      const activeUser: any = await this.tokenStorage.getUser().toPromise()
      const activeUserUsername = JSON.parse(activeUser).firstName
      this.username = activeUserUsername

      const channelId = this.chatService.currentChannel.sid
      this.channelSID = channelId
      const channelAPI = await this.chatService.getChannelAPI({ id: channelId })
      const { channel } = channelAPI
      const users = await this.chatService.getUsersByIds(userNames)
      const blockedUsers = await this.chatService.getChannelBlockList({ id: channel._id })
      const blockedUsersIds = blockedUsers.map(user => user.user._id)

      this.members = users.filter(user => blockedUsersIds.indexOf(user._id) > -1 || user.firstName == activeUserUsername ? false : true)
      this.blockedMembers = blockedUsers
      this.channelAPI = channel

      this.isLoadingMembers = false
      this.isLoadingBlockedMembers = false
    } catch (e) {
      console.log(e)
      this.dialogRef.close()
    }
  }

  async sendFriendRequest(user) {
    try {
      const { _id, firstName } = user
      const request = await this.friendService.sendFriendRequest({ recipient: _id })
      this.snackBar.open(`Friend request sent to ${firstName}`, null, { duration: 3000 })
      console.log(request)
    } catch (e) {
      console.log(e)
    }
  }

  async blockUser(userId) {
    try {
      const block = await this.chatService.blockUser({ userId, channelId: this.channelAPI._id })
      this.members = this.members.filter(member => member._id == userId ? false : true)
      this.blockedMembers.push(block)
    } catch (e) {
      console.log(e)
      this.dialogRef.close()
    }
  }

  async unblockUser(blockId, user) {
    try {
      const unblock = await this.chatService.unblockUser({ blockId })
      this.blockedMembers = this.blockedMembers.filter(block => block._id == blockId ? false : true)
      this.members.push(user)
    } catch (e) {
      console.log(e)
      this.dialogRef.close()
    }
  }

  openGitProfile(user) {
    const { providerType, firstName } = user
    const url = `https://${providerType}${providerType == 'bitbucket' ? '.org' : '.com'}/${firstName}`
    const win = window.open(url, '_blank')
    win.focus()
  }

  async isOwnerAccount() {
    const activeUser: any = await this.tokenStorage.getUser().toPromise()
    const activeUserUsername = JSON.parse(activeUser).firstName
    console.log(this.chatService.currentChannel.state.createdBy, activeUserUsername)
    return !!(this.chatService.currentChannel.state.createdBy == activeUserUsername)
  }

}
