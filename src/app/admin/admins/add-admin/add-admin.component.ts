import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { AdminService } from '../../../services/admin.service'
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-admin',
  templateUrl: './add-admin.component.html',
  styleUrls: ['./add-admin.component.scss']
})
export class AddAdminComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  public displayedColumns: string[] = ['name', 'email', 'loginProvider', 'options']
  public dataSource: MatTableDataSource<any>
  public users: any = []
  public adminRole: any

  constructor(
    private api: AdminService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddAdminComponent>,
  ) { }

  ngOnInit() {
    console.log(this.data)
  }

  addAdmin(userId: string, username: string) {
    Swal
      .fire({
        title: 'Confirm promoting user',
        text: `Are you sure you want to promote user ${username} to admin?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Close'
      })
      .then(async result => {
        if (result.value) {
          try {
            await this.api.addAdmin(userId, this.data.roleId)
            this.dialogRef.close()
          } catch (e) {
            console.log(e)
          }
        }
      })
  }

  async applyFilter(filterValue: string) {
    this.users = await this.api.searchUsers(filterValue)
    this.dataSource = new MatTableDataSource(this.users.map(user => user.user))
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
  }
}
