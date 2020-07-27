import { Component, OnInit, ViewChild } from '@angular/core';
import { ChatService } from '../../services/chat.service'
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  public displayedColumns: string[] = ['name', 'email', 'loginProvider', 'channel', 'options']
  public dataSource: MatTableDataSource<any>
  public isShowingUser: boolean = false
  public shownUser: any
  public isBanned: boolean = false

  constructor(
    public chatService: ChatService,
    public adminService: AdminService
  ) {
    this.dataSource = new MatTableDataSource(this.users)
  }

  public users: any[] = []

  async ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    const users = await this.chatService.getAllUsers()
    this.users = users
    this.dataSource = new MatTableDataSource(this.users)
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public async showUser(user) {
    if (this.shownUser && this.shownUser._id == user.id) {
      this.isShowingUser = false
    } else {
      this.shownUser = user
      this.isShowingUser = true
      const fetchedUser = await this.chatService.getUsersByIds([this.shownUser.firstName])
      this.isBanned = fetchedUser.isBanned === null || undefined ? false : fetchedUser[0].isBanned
    }
  }

  public async toggleBan() {
    this.isBanned = !this.isBanned
    await this.adminService.setUserBan({ id: this.shownUser._id, isBanned: this.isBanned})
  }
}