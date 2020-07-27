import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AdminService } from '../../../services/admin.service'

@Component({
  selector: 'app-insights-news',
  templateUrl: './insights-news.component.html',
  styleUrls: ['./insights-news.component.scss']
})
export class InsightsNewsComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  public news: any
  public loaded: boolean
  public error: boolean
  public displayedColumns: string[] = ['name', 'message', 'type', 'pageViews', 'createdAt', 'insights']
  public dataSource: MatTableDataSource<any>

  constructor(
    private adminService: AdminService
  ) { }

  async ngOnInit() {
    this.news = await this.adminService.getNews()
    this.dataSource = new MatTableDataSource(this.news)
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
