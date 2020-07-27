import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-creator-videos-viewers',
  templateUrl: './creator-videos-viewers.component.html',
  styleUrls: ['./creator-videos-viewers.component.scss']
})
export class CreatorVideosViewersComponent implements OnInit {
  @Input() videos: any

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  public displayedColumns: string[] = ['avatar', 'user', 'views', 'git']
  public dataSource: MatTableDataSource<any>

  public users = [
    { avatar: 'https://cdn2.iconfinder.com/data/icons/website-icons/512/User_Avatar-512.png', user: 'Test User Name', views: 100, git: '' },
    { avatar: 'https://cdn2.iconfinder.com/data/icons/website-icons/512/User_Avatar-512.png', user: 'Test User Name', views: 100, git: '' },
    { avatar: 'https://cdn2.iconfinder.com/data/icons/website-icons/512/User_Avatar-512.png', user: 'Test User Name', views: 100, git: '' },
    { avatar: 'https://cdn2.iconfinder.com/data/icons/website-icons/512/User_Avatar-512.png', user: 'Test User Name', views: 100, git: '' },
    { avatar: 'https://cdn2.iconfinder.com/data/icons/website-icons/512/User_Avatar-512.png', user: 'Test User Name', views: 100, git: '' }
  ]

  constructor() { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.users)
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
