import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service'

@Component({
  selector: 'app-admin-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss']
})
export class VideosComponent implements OnInit {

  constructor(
    private api: AdminService
  ) { }

  public videos: any = []

  async ngOnInit() {
    try {
      this.videos = await this.api.getAllVideos()
    } catch(e) {
      console.log(e)
    }
  }

}
