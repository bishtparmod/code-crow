import { Component, OnInit, ViewChild } from '@angular/core'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { MatTableDataSource } from '@angular/material/table'
import { CreatorSpaceService } from '../../creator-space.service'
import { VideoService } from '../../../../services/video.service'

@Component({
  selector: 'app-creator-playlists-details',
  templateUrl: './creator-playlists-details.component.html',
  styleUrls: ['./creator-playlists-details.component.scss']
})
export class CreatorPlaylistsDetailsComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator
  @ViewChild(MatSort, { static: true }) sort: MatSort

  public dataSource: MatTableDataSource<any>
  public displayedColumns: string[] = ['title', 'videos', 'views', 'createdAt', 'statistics', 'details']
  public videos: any

  constructor(
    public creatorSpaceService: CreatorSpaceService,
    public videoService: VideoService
  ) { }

  async ngOnInit() {
    try {
      this.videos = await this.videoService.getVideosData({ limit: 100, skip: 0, me: '1' })
    } catch (e) {
      console.log(e)
    }
  }

}
