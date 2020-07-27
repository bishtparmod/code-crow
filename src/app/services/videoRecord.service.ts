import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Socket } from './socket.service'
import { ChatService } from './chat.service'
import { TokenStorage } from '../auth/token.storage';

@Injectable({
  providedIn: 'root'
})
export class RecordingService {

  constructor(
    private http: HttpClient,
    private socket: Socket,
    // private chatService: ChatService,
    private tokenStorage: TokenStorage
  ) { }

  
}