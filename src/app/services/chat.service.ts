import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import * as Twilio from 'twilio-chat';
import Client from "twilio-chat";
import { Util } from "../util/util";
import { Channel } from "twilio-chat/lib/channel";
import { Router } from "@angular/router";
import { Message } from "twilio-chat/lib/message";
import { identity, Subscription } from 'rxjs';
import { TokenStorage } from '../auth/token.storage';
import * as Video from 'twilio-video';
import * as Audio from 'twilio-video';
import { LocalVideoTrack, LocalAudioTrack } from 'twilio-video'
import { MatSnackBar } from '@angular/material/snack-bar';
import { RecordingService } from './videoRecord.service'
import { Socket } from './socket.service'
import { v4 as uuidv4 } from 'uuid'
import { VideoService } from './video.service';

const TWILIO_TOKEN_KEY = "TwilioToken"
const TWILIO_VIDEO_TOKEN_KEY = "TwilioVideoToken"

declare var MediaRecorder: any;
(Array as any).prototype.swap = function (x, y) {
  var b = this[x];
  this[x] = this[y];
  this[y] = b;
  return this;
}
@Injectable({
  providedIn: "root"
})
export class ChatService {
  public loadingTexts: Boolean = false
  public isShowingChat: Boolean = true
  public isShowingTexts: Boolean = false
  public isPasswordProtected: Boolean = false
  public lastMessageSendDate: Date = new Date()

  public isGettingChannels: Boolean = false
  public channels: Array<any> = []
  public channels_num: any
  public channelObj: any

  public chatClient: Client;
  public currentChannel: Channel | any;
  public chatConnectedEmitter: EventEmitter<any> = new EventEmitter<any>()
  public chatDisconnectedEmitter: EventEmitter<any> = new EventEmitter<any>()
  public channelJoinedEmmiter: EventEmitter<any> = new EventEmitter<any>()
  public channelsLoadedEmmiter: EventEmitter<any> = new EventEmitter<any>()
  public channelSwitchedEmmiter: EventEmitter<any> = new EventEmitter<any>()

  public $tokenSource = new Subject<any>();
  public messages = []
  public channelSid

  public videoRoom
  public sharedScreen
  public sharedAudio
  public hostLocalVideoTrack
  public videoStreamId: string
  public isHost: Boolean = false
  public videoTrack: LocalVideoTrack;
  public audioTrack: LocalAudioTrack;
  public error: string
  public isLoading = false
  public isStreamingMsgBackgroundOn: boolean = false
  public liveStreamings: any;

  constructor(
    private router: Router,
    public http: HttpClient,
    public tokenStorage: TokenStorage,
    private _snackBar: MatSnackBar,
    private _record: RecordingService,
    private socket: Socket,
    private videoService: VideoService
  ) { }

  async createChannelAPI({ channelSID, title, description, isPrivate, username }): Promise<any> {
    const user: any = await this.tokenStorage.getUser().toPromise()
    const userId = JSON.parse(user)._id
    return this.http.post('/api/channel/', { channelSID, title, description, isPrivate, user: userId })
      .toPromise()
  }

  getChannelAPI({ id }): Promise<any> {
    return this.http.get(`/api/channel/${id}`)
      .toPromise()
  }

  getUsersByIds(userNames: Array<string>): Promise<any> {
    return this.http.post(`/api/users/usersByIDs`, { userNames })
      .toPromise()
  }

  getAllUsers(): Promise<any> {
    return this.http.get(`/api/users/allUsers`)
      .toPromise()
  }

  getChannelBlockList({ id }): Promise<any> {
    return this.http.get(`/api/channel/${id}/blocks`)
      .toPromise()
  }

  async blockUser({ userId, channelId }): Promise<any> {
    return this.http.post(`/api/channel/blocks`, { user: userId, channel: channelId })
      .toPromise()
  }

  unblockUser({ blockId }): Promise<any> {
    return this.http.delete(`/api/channel/blocks/${blockId}`)
      .toPromise()
  }

  async isUserBlocked({ username, channelId }): Promise<any> {
    const user: any = await this.tokenStorage.getUser().toPromise()
    const userId = JSON.parse(user)._id
    return this.http.get(`/api/channel/blocks/${userId}/${channelId}`)
      .toPromise()
  }

  sendNotifications(body, title, userNames): Promise<any> {
    return this.http.post('/api/notifications/push', { body, title, userNames })
      .toPromise()
      .then(res => res)
      .catch(err => err)
  }

  toggleChat() {
    this.isShowingChat = !this.isShowingChat
  }

  generateToken(identity): Promise<any> {
    return this.http
      .post('/api/twilio/chat-token', { identity, deviceId: "Browser" })
      .toPromise()
      .then((data: any) => {
        this.setTwilioToken(data.token);
        this.saveTwilioToken(data.token);
        return data;
      })
  }

  deleteMessage(message: Message): Promise<void> {
    return message.remove().then(console.log).catch(console.error)
  }

  postFile(fileToUpload: File): Promise<any> {
    const endpoint = '/api/media/uploadFile';
    const formData: FormData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    return this.http
      .post(endpoint, formData)
      .toPromise()
      .then((res) => {
        return res
      });
  }


  public isConnected = false
  connect(token): Promise<any> {
    return Twilio.Client.create(token.token).then((client: Client) => {
      this.chatClient = client;
      this.getChannels()
      this.isConnected = true
      this.chatConnectedEmitter.emit(true)
      return client;
    }).catch((err: any) => {
      this.chatDisconnectedEmitter.emit(false);
      if (err.message.indexOf('token is expired')) {
        localStorage.removeItem('twackToken');
        this.router.navigate(['/']);
      }
    });
  }

  public allChannels: Array<any> = []

  loadMoreChannels(skip: number, limit: number) {
    if (skip >= this.allChannels.length) return
    this.channels = [...this.channels, ...this.allChannels.slice(skip, skip + limit)]
    this.channels_num = skip + limit;
  }

  loadChannels(skip: number, limit: number) {
    if (skip >= this.allChannels.length) return
    this.channels = this.allChannels.slice(skip * limit, (skip * limit) + limit)
  }

  getChannels(spinner = false): Promise<any> {
    if (spinner)
      this.isGettingChannels = true;

    return this.getPublicChannels().then(async (channels: any) => {
      this.channelObj = channels;
      this.allChannels = this.channelObj.items
        .filter(channel => !channel.friendlyName.startsWith("__hide__"))
        .sort((a, b) => b.membersCount - a.membersCount);
      this.channels = this.allChannels
      this.channels_num = 1;

      if (spinner)
        this.isGettingChannels = false;

      this.channelsLoadedEmmiter.emit(true)
      return channels.items;
    });
  }

  getAllChannels(spinner = false, filter: string = '', pageLimit: number = 5, pageNumber: number = 0): Promise<any> {
    if (spinner)
      this.isGettingChannels = true;

    return this.getPublicChannels().then(async (channels: any) => {
      this.channelObj = channels;
      this.allChannels = this.channelObj.items
        .filter(channel => !channel.friendlyName.startsWith("__hide__"))
        .sort((a, b) => b.membersCount - a.membersCount);

      this.loadChannels(pageNumber, pageLimit)
      const channelItems = this.channels.filter(channel => channel.friendlyName.includes(filter))

      if (spinner)
        this.isGettingChannels = false;

      const count = this.allChannels.length

      return { channelItems, count }
    });
  }

  getFilteredChannels(filter: string = '', pageLimit: number = 5, pageNumber: number = 0): any {
    this.loadChannels(pageNumber, pageLimit)
    const channelItems = this.channels.filter(channel => channel.friendlyName.includes(filter))
    const count = this.allChannels.length
    return { channelItems, count }
  }

  getPublicChannels() {
    return this.chatClient.getPublicChannelDescriptors();
  }

  async getChannel(sid: string): Promise<any> {
      return this.chatClient.getChannelBySid(sid)
        .then(channel => channel)
        .catch(err => new Error('Not Found'))
  }

  isHostingChannel(identity: string) {
    return this.channels.some((channel: Channel) => !!(channel.createdBy == identity))
  }

  getHostedChannel(identity: string) {
    const channels: Channel[] = this.channels.filter((channel: Channel) => !!(channel.createdBy == identity) ? true : false)
    return channels.length ? channels[0].sid : null
  }

  async createChannel(friendlyName: string, identity: string, attributes: any = {}, isPrivate: boolean = false) {
    if (this.isHostingChannel(identity)) {
      return Promise.reject({
        status: 401, message: "You're already hosting a channel."
      })
    } else {
      return await this.chatClient
        .createChannel({
          friendlyName,
          isPrivate,
          attributes, // Custom properties
          uniqueName: Util.guid()
        })
        .then(async (channel: Channel) => {
          const { sid } = channel
          const $user: any = await this.tokenStorage.getUser().toPromise()
          const user = JSON.parse($user)
          const username = user.username ? user.username : user.firstName
          this.isHost = username == channel.createdBy
          this.channelSid = sid
          await this.createChannelAPI({ channelSID: sid, username, isPrivate, title: friendlyName, description: attributes.description })
          this.socket.emitChannelAdded()
          this.getChannels()
          return channel
        })
    }
  }

  async updateUserChannelAPI(channelSID) {
    try {
      // const userUpdate = await this.http.patch('/channel/joinOrLeave', { channelSID }).toPromise()
      // this.tokenStorage.saveUser(userUpdate)
      return true
    } catch (e) {
      console.log(e)
    }
  }

  public isDeleting: boolean = false
  leaveChannel(identity, reloadChannels = false, deleteOnExit = true) {
    return new Promise(async (resolve, reject) => {
      if (this.currentChannel) {
        this.isShowingTexts = false
        this.liveStreamings = null
        const channel: Channel = await this.currentChannel.leave()
        const username = channel.createdBy
        if (username === identity && deleteOnExit) {
          this.isDeleting = true
          const deleteChannel = await channel.delete()
          this.currentChannel = null

          if (deleteChannel) {
            this.isDeleting = false
            this.getChannels(false)
          }

          channel.removeAllListeners()
          this.socket.emitChannelRemoved()
          this.updateUserChannelAPI(null)

          resolve(true)
        } else {
          const $user: any = await this.tokenStorage.getUser().toPromise()
          const user = JSON.parse($user)
          this.updateUserChannelAPI(null)
          this.currentChannel = null
          if (reloadChannels)
            this.getChannels(false)
          channel.removeAllListeners();
          this.channelSwitchedEmmiter.emit(true)
          resolve(channel)
        }
      } else {
        return resolve();
      }
    })
  }

  async sendMessage(chatMessage, attributes = {}): Promise<any> {
    const dateNow = new Date()
    const diff = Math.round(Math.abs((dateNow.getTime() - this.lastMessageSendDate.getTime()) / 1000))
    if (diff <= 0.7) {
      this._snackBar.open("Please be courteous to other users and try to not spam", null, { duration: 1000 })
      return Promise.resolve()
    } else {
      const $user: any = await this.tokenStorage.getUser().toPromise()
      const user = JSON.parse($user)
      const usernames = []
      this.currentChannel.members.forEach(member => { usernames.push(member.state.identity) })
      const body = `${user.username}: ${chatMessage}`
      const title = `New message at ${this.currentChannel.state.friendlyName}`
      const sendNotificationTo = usernames.filter($username => $username == user.username ? false : true)
      //TODO: fix this to also check if attributes CONTAINS avatar. 
      //This will cover the case where if attributes is passed in parameters and avatar isn't provided.
      if (this.isEmpty(attributes)) {
        attributes = {
          avatar: user.avatar
        }
      }
      this.lastMessageSendDate = new Date()
      return Promise.all([
        this.currentChannel.sendMessage(chatMessage, attributes),
        this.sendNotifications(body, title, sendNotificationTo)
      ])
    }

  }

  isEmpty(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key))
        return false;
    }
    return true;
  }

  public messagePage
  async getMessages() {
    this.loadingTexts = true
    try {
      const messages = await this.currentChannel.getMessages()
      this.loadingTexts = false
      this.messagePage = messages
      this.messages = messages.items
      return messages
    } catch (e) {
      return e
    }
  }

  async getPreviousMessages() {
    if (this.messagePage.hasPrevPage) {
      const page = await this.messagePage.prevPage()
      const items = page.items.reverse()
      items.forEach(item => this.messages.unshift(item))
      this.messagePage = page
    }
  }

  submitPassword(password) {
    if ((<any>this.currentChannel.attributes).password == password) {
      this.isPasswordProtected = false
    }
  }

  async enterChannel(sid: string, identity: string): Promise<any> {
    try {
      this.currentChannel = await this.getChannel(sid)
      const joinedChannel = await this.currentChannel.join()
      const prepareChannel = await this.prepareChannel(joinedChannel, identity)
      this.channelJoinedEmmiter.emit(prepareChannel)
      return prepareChannel
    } catch (e) {
      this.currentChannel = await this.leaveChannel(identity, true, false)
      const joinedChannel = await this.currentChannel.join()
      const prepareChannel = await this.prepareChannel(joinedChannel, identity)
      this.channelJoinedEmmiter.emit(prepareChannel)
      return prepareChannel
    }
  }

  async prepareChannel(c: Channel, identity) {
    try {
      const messages = await this.getMessages()
      this.getChannels(false)
      this.isShowingTexts = true
      if ((<any>this.currentChannel.attributes).isPrivate && (this.currentChannel.createdBy != identity))
        this.isPasswordProtected = true
      else
        this.isPasswordProtected = false

      this.updateUserChannelAPI(this.currentChannel.sid)
      this.isHost = identity == this.currentChannel.createdBy
      this.channelSid = this.currentChannel.sid
      let channelIndex
      this.channels.forEach((channel, i) => {
        if (channel.sid == this.currentChannel.sid)
          channelIndex = i
      })
      this.channels = (this.channels as any).swap(channelIndex, 0)

      if (this.currentChannel.createdBy != identity && !(<any>this.currentChannel.attributes).isPrivate) {
        const videoRoom = await this.connectToVideoRoom(this.currentChannel.sid)
        if (videoRoom.error) {
          this._snackBar.open(videoRoom.error, null, { duration: 3000 })
        } else {
          return videoRoom
        }
      }

      return { connected: true }
    } catch (e) {
      console.log(e)
    }
  }

  async generateVideoToken(roomId): Promise<any> {
    const $user: any = await this.tokenStorage.getUser().toPromise()
    const identity = JSON.parse($user).firstName
    return this.http
      .post('/api/twilio/video-token', { identity, deviceId: roomId })
      .toPromise()
      .then((data: any) => {
        this.setTwilioVideoToken(data.token);
        this.saveTwilioVideoToken(data.token);
        return data;
      })
  }

  public roomParticipants: any = {}

  async participantConnected(participant) {
    this.addParticipantAPI(participant.identity)
    this.sendMessage(`${participant.identity} joined the live stream.`)
  }

  participantDisconnected(participant) {
    this.sendMessage(`${participant.identity} left the live stream.`)
    this.endparticipant(participant.identity)
  }

  public isHostDisconnected: Boolean = false
  hostDisconnected(participant) {
    if (participant.identity == this.currentChannel.state.createdBy) {
      this.isHostDisconnected = true
    }
  }

  public toggleMediaRecorder() {
    if (!this.streamOptions.mediaRecorder) {
      this.initUploadStream()
    } else if (this.streamOptions.mediaRecorder && this.streamOptions.isRecording) {
      this.streamOptions.mediaRecorder.pause()
      this.streamOptions.isRecording = false
    } else if (this.streamOptions.mediaRecorder && !this.streamOptions.isRecording) {
      this.streamOptions.mediaRecorder.resume()
      this.streamOptions.isRecording = true
    }
  }

  public toggleMute() {
    const { audioStream } = this.streamOptions
    if (audioStream && audioStream.isEnabled) {
      audioStream.disable()
    } else {
      audioStream.enable()
    }
  }

  public async toggleStream() {
    const { audioStream, videoStream } = this.streamOptions

    if (audioStream) {
      if (audioStream.isEnabled) {
        audioStream.disable()
      } else {
        audioStream.enable()
      }
    }

    if (videoStream) {
      if (videoStream.isEnabled) {
        videoStream.disable()
        this.toggleMediaRecorder()
        const livestreaming = await this.endStreamAPI()
        if (this.liveStreamings && this.liveStreamings.length) {
          this.liveStreamings[this.liveStreamings.length - 1] = livestreaming
        }
      } else {
        videoStream.enable()
        this.toggleMediaRecorder()
        const stream = await this.createStreamAPI(this.currentChannel.friendlyName)
        const channel = await this.getChannelAPI({ id: this.currentChannel.sid })
        this.liveStreamings = channel.liveStreaming
        this.streamOptions.streamId = stream._id
      }
    }
  }

  public async endLiveStream() {
    const { audioStream, videoStream, isLiveStreaming } = this.streamOptions
    if (videoStream && isLiveStreaming) {
      try {
        if (audioStream) {
          audioStream.disable()
          this.audioTrack.stop()
        }
        if (videoStream.isEnabled) {
          await this.endStreamAPI()
          videoStream.disable()
          this.toggleMediaRecorder()
        }
        this.videoRoom.disconnect()
        this.streamOptions = {
          streamId: null,
          channelId: null,
          mediaStream: null,
          mediaRecorder: null,
          isRecording: false,
          isLiveStreaming: false,
          audioStream: null,
          videoStream: null,
          videoParts: [],
          currentVideoPartId: null,
          hasPreviousVideoParts: false
        }
        this.videoTrack.stop()
        this.socket.endLiveStream()
        this.videoPartSubscription.unsubscribe()
        this.videoStreamId = null
      } catch (e) {
        console.log(e)
      }
    }
  }

  private _arrayBufferToBase64(buffer: ArrayBuffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  public videoPartSubscription: Subscription
  public async initUploadStream() {
    const { streamId, channelId } = this.streamOptions
    if (streamId && channelId) {
      const mediaStreamArray = [this.videoTrack]
      if (this.audioTrack) {
        mediaStreamArray.push(this.audioTrack)
      }
      this.streamOptions.mediaStream = new MediaStream(mediaStreamArray)
      const options = { mimeType: "video/webm" }
      this.streamOptions.mediaRecorder = new MediaRecorder(this.streamOptions.mediaStream, options)

      this.streamOptions.mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0 && this.streamOptions.currentVideoPartId) {
          const buffer = event.data
          this.socket.emitStreamData({ buffer, ssid: this.streamOptions.currentVideoPartId })
        } else {
          console.log('No data Available')
        }
      }

      this.streamOptions.mediaRecorder.start(1000)

      this.streamOptions.mediaRecorder.onstart = async () => {
        console.log('>> STARTED')
        const user: any = await this.tokenStorage.getUser().toPromise()
        const $ssid = uuidv4()
        const data = {
          stream: this.streamOptions.streamId,
          channel: this.streamOptions.channelId,
          user: JSON.parse(user)._id,
          ssid: $ssid,
          name: `${this.currentChannel.friendlyName}- Part ${this.streamOptions.videoParts.length}`
        }

        this.socket.emitStreamStarted(data)

        this.videoPartSubscription = this.socket.videoPartListner().subscribe($videoPart => {
          console.log($videoPart)
          const self = this
          const videoPart = {
            ...$videoPart,
            isInProgress: true,
            editName: async function ($e) {
              const { innerText } = $e.srcElement
              if (!this.isUploading && !this.isUploaded && !this.isInprogress && !this.isProcessing && innerText != this.name) {
                this.isProcessing = true
                await self.videoService.updateVideoPart({ id: this._id, name: innerText })
                this.name = innerText
                this.isProcessing = false
              } else {
                $e.srcElement.innerText = this.name
              }
            },
            upload: function () {
              const { isInProgress, isProcessing, isConverted, isUploading, ssid } = this
              if (!isInProgress && !isProcessing && isConverted && !isUploading) {
                self.socket.emitStartUpload(ssid)
                this.isUploading = true
                self.socket.uploadfinishedListner(ssid)
                  .subscribe(_ => {
                    this.isUploading = false;
                    this.isUploaded = true;
                  })
              } else {
                alert('Another operation is currently running on this video part.')
                return 'Another operation is currently running on this video part.'
              }
            },
            download: function () {
              const { isInProgress, isProcessing, isConverted, isUploading } = this
              if (!isInProgress && !isProcessing && isConverted && !isUploading) {
                window.open(`${location.origin}/api/video-parts/${this.ssid}/download`)
              }
            },
            ssid: $videoPart.ssid == $ssid ? uuidv4() : $ssid,
            newVideoPart: function () {

              const $data = {
                stream: self.streamOptions.streamId,
                channel: self.streamOptions.channelId,
                user: JSON.parse(user)._id,
                ssid: this.ssid,
                name: `${self.currentChannel.friendlyName}- Part ${self.streamOptions.videoParts.length}`
              }
              self.socket.emitStreamStarted($data)
              setTimeout(() => {
                const $$ssid = self.streamOptions.videoParts[self.streamOptions.videoParts.length - 2].ssid
                self.socket.emitVideoStartConversion({
                  ssid: $$ssid
                })
                self.streamOptions.videoParts[self.streamOptions.videoParts.length - 2].isProcessing = true
                self.socket.videoPartProcessedListner($$ssid)
                  .subscribe(({ conversion }) => {
                    const { thumbnail } = conversion
                    const thumbnailSrc = self._arrayBufferToBase64(thumbnail)
                    console.log(">> THUMBNAIL AVAILABLE", conversion)
                    self.streamOptions.videoParts[self.streamOptions.videoParts.length - 2].isInProgress = false
                    self.streamOptions.videoParts[self.streamOptions.videoParts.length - 2].isProcessing = false
                    self.streamOptions.videoParts[self.streamOptions.videoParts.length - 2].isConverted = true
                    self.streamOptions.videoParts[self.streamOptions.videoParts.length - 2].isUploading = false
                    self.streamOptions.videoParts[self.streamOptions.videoParts.length - 2].thumbnail = thumbnailSrc
                  })
              }, 2000)
            },
            refreshDuration: function () {
              this.duration = 0
              const interval = setInterval(() => {
                if (self.streamOptions.isRecording && self.streamOptions.currentVideoPartId == this.ssid)
                  this.duration++
                if (this.duration == 30) {
                  this.newVideoPart()
                  clearInterval(interval)
                }
              }, 1000)
            }
          }

          videoPart.refreshDuration()
          this.streamOptions.currentVideoPartId = videoPart.ssid
          this.streamOptions.videoParts.push(videoPart)
        })
        this.streamOptions.isRecording = true
      }

      this.streamOptions.mediaRecorder.onpause = async () => {
        console.log('>> Pausing media recorder')
      }

      this.streamOptions.mediaRecorder.onresume = async () => {
        console.log('>> Resuming media recorder')
      }

      this.streamOptions.mediaRecorder.onstop = async () => {
        console.log('>> Stopping media recorder')
      }

      setInterval(() => {

      }, 30000)
    } else {
      console.log('>> Please initialize a live stream first')
    }

  }

  public streamOptions:
    {
      streamId: string,
      channelId: string,
      mediaStream: MediaStream,
      mediaRecorder: MediaRecorder,
      isRecording: boolean,
      isLiveStreaming: boolean,
      audioStream: Audio.LocalAudioTrack,
      videoStream: Video.LocalVideoTrack,
      videoParts: Array<any>,
      currentVideoPartId: string,
      hasPreviousVideoParts: boolean
    } = {
      streamId: null,
      channelId: null,
      mediaStream: null,
      mediaRecorder: null,
      isRecording: false,
      isLiveStreaming: false,
      audioStream: null,
      videoStream: null,
      videoParts: [],
      currentVideoPartId: null,
      hasPreviousVideoParts: false
    }

  async connectToVideoRoom(roomId, title = null, screenTrack = null): Promise<any> {
    this.channelSid = roomId
    try {
      const VideoToken = await this.generateVideoToken(roomId)
      return new Promise((resolve, reject) => {
        if (screenTrack && screenTrack[0]) {
          Video.connect(VideoToken.token, { name: roomId, tracks: screenTrack })
            .then(async room => {
              room.participants.forEach(participant => this.participantConnected(participant))
              room.on('participantConnected', participant => this.participantConnected(participant))
              room.on('participantDisconnected', participant => this.participantDisconnected(participant))
              room.once('disconnected', error => room.participants.forEach(participant => this.participantDisconnected(participant)))
              this.videoRoom = room
              console.log('>> ROOM:', room)
              const stream = await this.createStreamAPI(title)
              const channel = await this.getChannelAPI({ id: this.currentChannel.sid })
              this.liveStreamings = channel.liveStreaming
              this.streamOptions.streamId = stream._id
              this.streamOptions.channelId = channel.channel._id
              this.streamOptions.isLiveStreaming = true
              this.sendMessage('Started Live Streaming.')
              this.hostLocalVideoTrack = screenTrack[0]
              resolve({ room })
            })
            .catch(err => {
              console.log(err)
              reject(err)
            })
        } else {
          Video.connect(VideoToken.token, { name: roomId, tracks: [] })
            .then(async room => {
              try {
                this.videoRoom = room
                const roomHost = room.participants.values().next().value
                if (!roomHost) {
                  this.videoRoom.disconnect()
                  resolve({ error: "Channel doesn't have an active live streaming." })
                } else {
                  setTimeout(async () => {
                    const videoTrack = roomHost.videoTracks.values().next().value
                    const audioTrack = roomHost.audioTracks.values().next().value
                    if (!videoTrack) {
                      this.videoRoom.disconnect()
                      resolve({ error: "Channel doesn't have an active live streaming." })
                    } else {
                      this.isHostDisconnected = false
                      this.sharedScreen = videoTrack
                      this.sharedAudio = audioTrack
                      const stream = await this.getLiveStreamAPI()
                      this.videoStreamId = stream._id
                      resolve({ room, videoTrack, audioTrack })
                    }
                  }, 2000)
                }
              } catch (e) {
                reject({ error: "Channel doesn't have an active live streaming." })
              }
            })
            .catch(err => {
              reject({ error: "Channel doesn't have an active live streaming." })
            })
        }
      })
    } catch (e) {
      console.log('>> CONNECTION ERR:', e)
    }
  }

  async shareScreen(screenTrack) {
    return new Promise(async (resolve, reject) => {
      try {
        const share = await this.videoRoom.localParticipant.publishTrack(screenTrack);
        resolve(share)
      } catch (e) {
        console.log(e)
        reject(e)
      }
    })
  }

  createStreamAPI(title): Promise<any> {
    return this.http
      .post('/api/liveStreaming', { channelSid: this.channelSid, title })
      .toPromise()
      .then((res: any) => {
        this.videoStreamId = res._id
        return res
      })
  }

  async getLiveStreamAPI() {
    const channel = await this.getChannelAPI({ id: this.channelSid })
    return this.http
      .get(`/api/channel/${channel.channel._id}/liveStream/recent`)
      .toPromise()
      .then((res: any) => {
        return res
      })
  }

  addParticipantAPI(username): Promise<any> {
    const startDate = new Date()

    return this.http.post(`/api/liveStreaming/${this.videoStreamId}/participant`, { startDate, username })
      .toPromise()
      .then(res => {
        return res
      })
  }

  async rateStreamAPI(rate): Promise<any> {
    const $user: any = await this.tokenStorage.getUser().toPromise()
    const { firstName } = JSON.parse($user)

    return this.http.patch(`/api/liveStreaming/${this.videoStreamId}/participant/rate`, { rate, username: firstName })
      .toPromise()
      .then(res => {
        return res
      })
  }

  endparticipant(username): Promise<any> {
    return this.http.patch(`/api/liveStreaming/${this.videoStreamId}/participant/end`, { username })
      .toPromise()
      .then(res => {
        return res
      })
  }

  endStreamAPI(): Promise<any> {
    return this.http.patch(`/api/liveStreaming/${this.videoStreamId}/end`, {})
      .toPromise()
  }

  setTwilioToken(token): void {
    this.$tokenSource.next(token);
    (<any>window).twilioToken = token;
  }

  saveTwilioToken(token: string) {
    if (!token) return;
    window.localStorage.removeItem(TWILIO_TOKEN_KEY);
    window.localStorage.setItem(TWILIO_TOKEN_KEY, token);
  }

  setTwilioVideoToken(token): void {
    this.$tokenSource.next(token);
    (<any>window).twilioToken = token;
  }

  saveTwilioVideoToken(token: string) {
    if (!token) return;
    window.localStorage.removeItem(TWILIO_VIDEO_TOKEN_KEY);
    window.localStorage.setItem(TWILIO_VIDEO_TOKEN_KEY, token);
  }

  getTwilioToken(): string {
    return localStorage.getItem(TWILIO_TOKEN_KEY);
  }

  setStreamingEvents() {
    const cService = this
    this.videoTrack.onended = function () {
      cService.endLiveStream()
    }
  }

  setAudioEvents() {
    if (this.audioTrack) {
      const cService = this
      this.audioTrack.onended = function () {
        if (this.streamOptions.audioStream.isEnabled) {
          cService.streamOptions.audioStream.disable()
        }
      }
    }
  }

  async shareToTwillio() {
    const screenTrack = [this.videoTrack]
    if (this.audioTrack) {
      screenTrack.push(this.audioTrack)
    }
    await this.connectToVideoRoom(this.channelSid, this.currentChannel.friendlyName, screenTrack)
  }

  getUserScreen(): Promise<LocalVideoTrack> {
    return new Promise(async (resolve, reject) => {
      var hasMic = false
      navigator.mediaDevices.enumerateDevices()
        .then(async (devices) => {
          devices.forEach((device) => {
            if (device.kind == 'audioinput') {
              hasMic = true
            }
          });
          if (hasMic) {
            console.log('>> HAS MIC')
            const audioTrack = await this.getAudio()
            const screenTrack = await this.getVideo()
            resolve({ audioTrack, screenTrack })
          }
          else {
            console.log('>> HAS NO MIC')
            const screenTrack = await this.getVideo()
            resolve({ screenTrack })
          }
        })
    })
  }

  async getVideo() {
    const videoStream = await (navigator.mediaDevices as any).getDisplayMedia({ video: true, audio: false })
    const videoTracks = videoStream.getTracks()
    const videoList = videoTracks.filter(track => track.kind == 'video' ? true : false)
    this.videoTrack = videoList[0]
    let screenTrack = null
    if (videoList.length > 0) { screenTrack = new Video.LocalVideoTrack(videoList[0]) }
    this.streamOptions.videoStream = screenTrack
    return screenTrack
  }

  async getAudio() {
    const audioStream = await (navigator.mediaDevices as any).getUserMedia({
      video: false,
      audio: { echoCancellation: true, noiseSuppression: true, deviceId: "default" }
    })
    const audioTracks = audioStream.getTracks()
    const audioList = audioTracks.filter(track => track.kind == 'audio' ? true : false)
    this.audioTrack = audioList[0]
    let audioTrack = null
    if (audioList.length > 0) { audioTrack = new Audio.LocalAudioTrack(audioList[0]) }
    this.streamOptions.audioStream = audioTrack
    return audioTrack
  }
}
