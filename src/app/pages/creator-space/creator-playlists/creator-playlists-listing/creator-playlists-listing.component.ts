import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CreatorSpaceService } from '../../creator-space.service';
import { MatDialog } from '@angular/material/dialog';
import { CreatorPlaylistsAddComponent } from '../creator-playlists-add/creator-playlists-add.component';

@Component({
  selector: 'app-creator-playlists-listing',
  templateUrl: './creator-playlists-listing.component.html',
  styleUrls: ['./creator-playlists-listing.component.scss']
})
export class CreatorPlaylistsListingComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  private _skip: number = 0
  private _limit: number = 100
  private _playlists: any

  public dataSource: MatTableDataSource<any>
  public displayedColumns: string[] = ['title', 'videos', 'views', 'createdAt', 'statistics', 'details']

  constructor(
    private creatorSpaceService: CreatorSpaceService,
    private dialog: MatDialog
  ) { }

  async ngOnInit() {
    try {
      this._playlists = await this.creatorSpaceService.getPlayLists({ skip: this._skip, limit: this._limit, me: '1' })
      this.dataSource = new MatTableDataSource(this._playlists)
      this.dataSource.paginator = this.paginator
      this.dataSource.sort = this.sort
    } catch (e) {
      console.log(e)
    }
  }

  async viewPlaylistDetails(id) {
    this.creatorSpaceService.viewPlaylistDetails({ id })
  }

  addPlaylist() {
    const dialogRef = this.dialog.open(CreatorPlaylistsAddComponent, {
      width: '450px'
    })
    dialogRef.afterClosed().subscribe(data => {
      this.ngOnInit()
    })
  }

  applyFilter(value) {

  }
}
