import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ChatService } from "../../../services/chat.service";
import { TokenStorage } from '../../../auth/token.storage'
import { Router } from '@angular/router';

interface channel {
  sid: string
  logoutChannel: string
  loginChannel: string
}

@Component({
  selector: 'app-owner-exit',
  templateUrl: './owner-exit.component.html',
  styleUrls: ['./owner-exit.component.scss']
})
export class OwnerExitComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<OwnerExitComponent>,
    public chatService: ChatService,
    @Inject(MAT_DIALOG_DATA) public data: channel,
    private tokenStorage: TokenStorage,
    private _router: Router
  ) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  async exitChannel() {
    const $user: any = await this.tokenStorage.getUser().toPromise()
    const identity = JSON.parse($user).firstName
    console.log('>> OWNER LEAVE')
    this.chatService.leaveChannel(identity, true, true)
      .then(_ => {
        console.log('>> NAVIGATING')
        this._router.navigate(['/'])
      })
  }

}
