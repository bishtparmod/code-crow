import { Component, OnInit, Input } from '@angular/core'
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar'
import { FriendService } from '../../services/friend.service'
import { CreateGroupComponent } from './create-group/create-group.component';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss']
})
export class FriendsComponent implements OnInit {
  @Input() friendList: any

  public searchTitle: string
  public searchResults = []

  constructor(
    public dialog: MatDialog,
    public friendService: FriendService,
    private _snackBar: MatSnackBar
  ) {

  }

  async searchUsers() {
    try {
      if (!this.searchTitle)
        this.searchResults = []
      else if (this.searchTitle.length >= 4) {
        this.searchResults = []
        const searchResult = await this.friendService.searchUsers(this.searchTitle)
        if (searchResult.length)
          this.searchResults = searchResult
        else
          this._snackBar.open("No users were found for your search criteria.", null, { duration: 2000 })
      } else {
        this._snackBar.open("Please input at least 4 characters.", null, { duration: 2000 })
      }
    } catch (e) {
      console.log(e)
    }
  }

  async groupChat() {
    const dialogRef = this.dialog.open(CreateGroupComponent, {
      width: "400px",
      data: {
        title: "",
        description: ""
      }
    })
  }

  ngOnInit() {
    
  }
}
