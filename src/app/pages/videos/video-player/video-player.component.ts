import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { VgAPI } from 'videogular2/compiled/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VideoService } from '../../../services/video.service'

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent implements OnInit {

  public video: any
  public videoId: String
  public videoURL: String

  public likes: number = 0
  public dislikes: number = 0
  public totalLikes: number = 0

  public views: number = 0
  public comment: String

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private videoService: VideoService,
    public playerAPI: VgAPI
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(async params => {
      const { id } = params
      this.videoId = id
      this.video = await this.videoService.getVideoData({ id })
      this.video.comments = this.video.comments.reverse()
      this.videoURL = await this.videoService.getVideoStream({ id })
      if (this.video) {
        this.filterLikes()
        this.views = this.video.views.map(view => view.viewCounter).reduce((a, b) => a + b)
      }
    })
  }

  async likeVideo(status: boolean) {
    try {
      await this.videoService.likeVideo({ status, id: this.videoId })
      this.updateLikes(status)
    } catch (e) {
      console.log(e)
    }
  }

  async addComment() {
    try {
      if (this.comment) {
        const comment = await this.videoService.comment({ body: this.comment, id: this.videoId })
        this.comment = null
        this.video.comments = [comment, ...this.video.comments]
      }
    } catch (e) {
      console.log(e)
    }
  }

  onPlayerReady(api: VgAPI) {
    this.playerAPI = api
    this.playerAPI.getDefaultMedia().subscriptions.timeUpdate.subscribe(event => {
      const { currentTime, duration } = event.srcElement
      const $currentTime = Math.ceil(currentTime)
    })
    this.playerAPI.getDefaultMedia().subscriptions.loadedData.subscribe(event => {
      console.log(event)
    })
  }

  public filterLikes() {
    this.totalLikes = this.video.likes.length
    this.likes = this.video.likes.filter(like => like.status).length
    this.dislikes = this.video.likes.filter(like => !like.status).length
  }

  public updateLikes(status) {
    this.ngOnInit()
    // this.totalLikes++
    // status ? this.likes++ : this.dislikes++
  }

  playVideo(videoId: string) {
    location.href = `video/${videoId}`
  }

}
