import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FriendService } from '../../../services/friend.service';

@Component({
  selector: 'app-friend-group-item',
  templateUrl: './friend-group-item.component.html',
  styleUrls: ['./friend-group-item.component.scss']
})
export class FriendGroupItemComponent implements OnInit {

  @Input() friend: any;
  friendModel = true;
  public selected = [];

  @Output() messageEvent = new EventEmitter<string>();

  constructor(
    private friendService: FriendService,
  ) { }

  ngOnInit() {
  }

  onSelect(member) {
    this.selected[member] = !this.selected[member];
    this.messageEvent.emit(member)
  }

}
