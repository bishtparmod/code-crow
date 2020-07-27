import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewsDialogComponent } from '../news-dialog/news-dialog.component';
import { NewsService } from '../../../services/news.service';
import { get } from 'lodash';
@Component({
  selector: 'app-news-item',
  templateUrl: './news-item.component.html',
  styleUrls: ['./news-item.component.scss']
})
export class NewsItemComponent implements OnInit {
  @Input() userNews: any;
  constructor(
    public dialogNews: MatDialog,
    private newsService: NewsService,
  ) { }

  ngOnInit() {

  }

  async showNewsDialog() {
    this.dialogNews.open(NewsDialogComponent, {
      width: '850px',
      data: {
        _id: this.userNews.news._id,
        title: this.userNews.news.title,
        body: this.userNews.news.body,
        createdAt: this.userNews.news.createdAt,
        thumbnail: this.userNews.news.thumbnail,
        image: this.userNews.news.image
      }
    });
    if (!get(this.userNews, 'news.isSeen', false)) {
      const res = await this.newsService.getNewsPage(this.userNews.news._id);
      console.log(res)
    }
  }
}
