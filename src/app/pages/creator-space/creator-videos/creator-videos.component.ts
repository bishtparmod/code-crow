import { Component, OnInit } from '@angular/core';
import { CreatorSpaceService } from '../creator-space.service';
import { TokenStorage } from '../../../auth/token.storage'

@Component({
  selector: 'app-creator-videos',
  templateUrl: './creator-videos.component.html',
  styleUrls: ['./creator-videos.component.scss']
})
export class CreatorVideosComponent implements OnInit {

  constructor(
    private api: CreatorSpaceService,
    private token: TokenStorage
  ) { }

  public videos: any

  async ngOnInit() {
    try {
      const user: any = await this.token.getUser().toPromise()
      const { _id } = JSON.parse(user)
      this.videos = await this.api.getUserVideos(_id)
    } catch (e) {
      console.log(e)
    }
  }
}
