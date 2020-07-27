import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NewsService } from '../../services/news.service'

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {

  public news = []
  public skip: number = 1000000
  public limit: number = 1000000 // Set desired limit here
  constructor(
    private router: Router,
    private newsService: NewsService,
  ) {
    
  }

  async ngOnInit() {
    this.news = await this.newsService.getUnseenUserNews(this.skip, this.limit)
    this.skip += this.limit
    this.news = this.news.reverse()
  }

  async loadMoreNews() {
    const news = await this.newsService.getUnseenUserNews(this.skip, this.limit)
    this.skip += this.limit
    this.news = [...this.news, ...news.reverse()]
  }

  async getUnseenUserNews() {
    this.ngOnInit()
  }
}
