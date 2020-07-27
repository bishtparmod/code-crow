import { Component, OnInit, Inject, ViewChild, Injectable, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FriendService } from '../../../services/friend.service';
import { Socket } from '../../../services/socket.service'
import { FriendGroupItemComponent } from "../friend-group-item/friend-group-item.component";

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.scss']
})
export class CreateGroupComponent implements OnInit {

  @ViewChild(FriendGroupItemComponent, { static: true }) child: FriendGroupItemComponent;
  public group = [];

  constructor(
    public friendService: FriendService,
    private dialogRef: MatDialogRef<CreateGroupComponent>,
    private _socket: Socket,
  ) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  async createGroup() {
    console.log('working : ', this.group)
  }

  receiveMessage($event) {
    console.log('User id : ', $event.user._id)
    const index = this.group.findIndex(user => user.user._id === $event.user._id)
    console.log('index is : ', index)

    if (index === -1) {
      this.group.push($event)
    } else {
      this.group.splice(index, 1)
    }
  }

}
