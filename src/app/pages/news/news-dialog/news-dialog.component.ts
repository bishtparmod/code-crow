import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  DomSanitizer,
  SafeHtml,
  SafeUrl,
  SafeStyle
} from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NewsService } from '../../../services/news.service';

interface news {
  _id: string
  title: string
  body: string
  createdAt: Date
  thumbnail: string
  image: string
}

@Component({
  selector: 'app-news-dialog',
  templateUrl: './news-dialog.component.html',
  styleUrls: ['./news-dialog.component.scss']
})
export class NewsDialogComponent implements OnInit {

  // public img
  public body
  constructor(
    private dialogRef: MatDialogRef<NewsDialogComponent>,
    private router: Router,
    private sanitization: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public news: news
  ) { }

  async ngOnInit() {
    try {
        // this.img = this.sanitization.bypassSecurityTrustStyle(`url("${this.userNew.image}")`)
        this.body = this.sanitization.bypassSecurityTrustHtml(this.news.body)
        console.log(this.body)
      } catch (e) {
        console.log(e)
        this.router.navigate(['/'])
      }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
