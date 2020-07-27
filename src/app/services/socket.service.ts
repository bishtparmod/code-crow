import { Injectable } from '@angular/core'
import { TokenStorage } from '../auth/token.storage'
import * as io from 'socket.io-client'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class Socket {
  private url: string = 'http://localhost:4040'
  public socket
  public socketId

  constructor(
    private tokenStorage: TokenStorage
  ) {
    this.socket = io(this.url)
    this.tokenStorage.getUser()
      .toPromise()
      .then(user => {
        if (user) {
          const { _id } = user as any
          this.socket.emit('connection-data', { _id })
          this.socketId = this.socket.id
        }
      })
  }

  emitChannelAdded() {
    this.socket.emit('channel-added')
  }

  emitChannelRemoved() {
    this.socket.emit('channel-removed')
  }

  emitStreamTimeDecrement(id: string) {
    this.socket.emit('update-remaining-time', { id })
  }

  listenChannelAdded(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('channel-added-confirm', data => {
        observer.next(data)
        return data
      })
    })
  }

  listenChannelRemoved(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('channel-removed-confirm', data => {
        observer.next(data)
        return data
      })
    })
  }

  emitVideoStartConversion({ ssid }) {
    this.socket.emit('convert-video-part', { ssid })
  }

  emitStreamData({ buffer, ssid }) {
    this.socket.emit('stream-data-available', { buffer, ssid })
  }

  emitProcessVideoPart(ssid: string) {
    this.socket.emit('process-video-part', { ssid })
  }

  videoPartListner(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('video-part', data => {
        observer.next(data)
        return data
      })
    })
  }

  videoPartProcessedListner(ssid: string): Observable<any> {
    return new Observable(observer => {
      this.socket.on(`process-video-part-${ssid}-completed`, data => {
        observer.next(data)
        return data
      })
    })
  }

  uploadfinishedListner(ssid: string): Observable<any> {
    return new Observable(observer => {
      this.socket.on(`upload-finished-${ssid}`, data => {
        observer.next(data)
        return data
      })
    })
  }

  emitStartUpload(ssid: string) {
    this.socket.emit('upload-video-part', { ssid })
  }

  emitStreamStarted({ user, channel, stream, ssid, name }) {
    this.socket.emit('stream-data-started', { stream, channel, user, ssid, name })
  }

  endLiveStream() {
    this.socket.emit('stream-data-ended')
  }

  addConnectionEvent(friend) {
    friend.onConnect = (): Observable<any> => {
      return new Observable(observer => {
        this.socket.on(`user-connected-${friend.user._id}`, data => {
          observer.next(data)
        })
        return () => {
          this.socket.disconnect()
        }
      })
    }
    friend.onDisconnect = (): Observable<any> => {
      return new Observable(observer => {
        this.socket.on(`user-disconnected-${friend.user._id}`, data => {
          observer.next(data)
        })
        return () => {
          this.socket.disconnect()
        }
      })
    }
    return friend
  }

  listenToFriendRequests(): Observable<any> {
    return new Observable(observer => {
      this.socket.on(`friend-request-recieved-${this.socketId}`, data => {
        console.log('>> RECIEVED FRIEND REQUEST')
        observer.next(data)
      })
      return () => {
        this.socket.disconnect()
      }
    })
  }

  listenToAcceptedFriendRequests(): Observable<any> {
    return new Observable(observer => {
      this.socket.on(`friend-request-accepted-${this.socketId}`, data => {
        console.log('>> ACCEPTED FRIEND REQUEST')
        observer.next(data)
      })
      return () => {
        this.socket.disconnect()
      }
    })
  }

  listenToMaintenanceMode(): Observable<any> {
    return new Observable(observer => {
      this.socket.on(`maintenance-mode`, data => {
        console.log('>> RECEIVED MAINTENANCE MODE')
        observer.next(data)
      })
      return () => {
        this.socket.disconnect()
      }
    })
  }

  emitMaintenanceMode({ isEnabled, message }) {
    this.socket.emit(`maintenance-mode`, { isEnabled, message })
  }

  listenToFriendMessage(): Observable<any> {
    return new Observable(observer => {
      this.socket.on(`friend-message-recieved-${this.socketId}`, data => {
        console.log('>> RECIEVED FRIEND MESSAGE')
        observer.next(data)
      })
      return () => {
        this.socket.disconnect()
      }
    })
  }

}
