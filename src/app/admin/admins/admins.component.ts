import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminService } from '../../services/admin.service'
import { AddAdminComponent } from './add-admin/add-admin.component'
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-admins',
  templateUrl: './admins.component.html',
  styleUrls: ['./admins.component.scss']
})
export class AdminsComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  public displayedColumns: string[] = ['name', 'email', 'loginProvider', 'options']
  public dataSource: MatTableDataSource<any>
  public shownUser: any
  public admins: any = []
  public adminRole: any

  constructor(
    private api: AdminService,
    private dialog: MatDialog
  ) {
    this.dataSource = new MatTableDataSource(this.admins)
  }

  async ngOnInit() {
    try {
      const roles = await this.api.getRoles()
      this.adminRole = roles[0]
      this.admins = await this.api.getAdmins(this.adminRole._id)
      this.dataSource = new MatTableDataSource(this.admins)
      this.dataSource.paginator = this.paginator
      this.dataSource.sort = this.sort
    } catch (e) {
      console.log(e)
    }
  }

  addAdmin() {
    const dialogRef = this.dialog.open(AddAdminComponent, {
      data: {
        roleId: this.adminRole._id
      },
      width: '900px'
    })
    dialogRef.afterClosed().subscribe(data => {
      this.ngOnInit()
    })
  }

  async removeAdmin(userId) {
    await this.api.removeAdmin(userId, this.adminRole._id)
    this.ngOnInit()
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
