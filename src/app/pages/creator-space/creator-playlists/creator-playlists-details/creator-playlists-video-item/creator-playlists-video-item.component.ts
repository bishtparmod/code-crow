import { Component, OnInit, Input } from '@angular/core';
import { CreatorSpaceService } from '../../../creator-space.service'

@Component({
  selector: 'app-creator-playlists-video-item',
  templateUrl: './creator-playlists-video-item.component.html',
  styleUrls: ['./creator-playlists-video-item.component.scss']
})
export class CreatorPlaylistsVideoItemComponent implements OnInit {
  @Input() video: any
  @Input() hideButtons: any
  @Input() hideStatistics: any
  
  public showButton: boolean
  public totalViews: number
  public totalRate: number
  
  constructor(
    public creatorSpaceService: CreatorSpaceService
  ) { }

  ngOnInit() {
    this.hideButtons = this.hideButtons == '1' ? true : false
    this.hideStatistics = this.hideStatistics = '1' ? true : false
    this.showButton = this.creatorSpaceService.playlist.videos.filter(video => !!(video._id == this.video._id)).length ? true : false
    this.totalViews = this.video.views.map(view => view.viewCounter).reduce((a, b) => a + b)
    this.totalRate = Math.round((this.video.likes.filter(like => like.status).length / this.video.likes.length) * 100)
    const that = this
    this.video.addToPlaylist = async function () {
      await that.creatorSpaceService.addVideoToPlaylist({ id: that.creatorSpaceService.playlist._id, fk: this._id })
      that.showButton = true
      that.creatorSpaceService.playlist.videos.push(this)
    }

    this.video.removeFromPlaylist = async function () {
      await that.creatorSpaceService.removeVideoFromPlaylist({ id: that.creatorSpaceService.playlist._id, fk: this._id })
      that.showButton = false
      that.creatorSpaceService.playlist.videos = that.creatorSpaceService.playlist.videos.filter(video => !!(video._id != this._id))
    }
  }

}
