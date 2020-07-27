import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  public unseenNewsCount: any = 0
  public preventLoading: boolean = false

  constructor(
    private http: HttpClient
  ) { }

  public getAllNews(skip, limit): Promise<any> {
    return this.http.get('/api/news', { params: { skip, limit } }).toPromise()
  }

  public async getUnseenUserNews(skip, limit) {
    if (!this.preventLoading) {
      let unseenCount = 0;
      const unseenNews: any = await this.http.get('/api/news/unseen/me', { params: { skip, limit } }).toPromise()
      if (!unseenNews.length) {
        this.preventLoading = true
        return []
      } else {
        if (unseenNews) {
          unseenNews.map(news => {
            if (news.isSeen === false) {
              unseenCount = unseenCount + 1;
            }
          });
          this.unseenNewsCount = unseenCount;
        }
        return unseenNews;
      }
    } else {
      return []
    }
  }

  public getNewsPage(newsId) {
    return this.http.get(`/api/news/${newsId}`).toPromise()
  }
}
