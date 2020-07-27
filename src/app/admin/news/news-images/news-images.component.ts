import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'
import { AdminService } from '../../../services/admin.service'
import { HttpEvent, HttpEventType } from '@angular/common/http'
import { MatSnackBar } from '@angular/material/snack-bar'

@Component({
  selector: 'app-news-images',
  templateUrl: './news-images.component.html',
  styleUrls: ['./news-images.component.scss']
})
export class NewsImagesComponent implements OnInit {
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef
  public file: File
  public progress: number = 0
  public images: Array<string>

  constructor(
    private adminService: AdminService,
    private _snackBar: MatSnackBar
  ) { }

  async ngOnInit() {
    this.images = await this.adminService.getBucketItems('news')
  }

  public selectImage() {
    this.fileInput.nativeElement.click()
  }

  public copyToClipboard(item: string) {
    document.addEventListener('copy', (e: ClipboardEvent) => {
      e.clipboardData.setData('text/plain', (item))
      e.preventDefault()
      document.removeEventListener('copy', null)
      this._snackBar.open('Image URL copied to clipboard.', null, { duration: 1500 })
    })
    document.execCommand('copy')
  }

  public async uploadImage($event) {
    if ($event.target.files.length > 0) {
      this.file = $event.target.files[0]
      const fileName = this.file.name
      const fileType = this.file.type
      try {
        const url = await this.adminService.getUploadURL({ fileName, fileType, bucketName: 'news' })
        this.adminService.uploadFile(this.file, url.url)
          .subscribe((event: HttpEvent<any>) => {
            switch (event.type) {
              case HttpEventType.Sent:
                console.log('Request has been made!')
                break
              case HttpEventType.ResponseHeader:
                console.log('Response header has been received!')
                break
              case HttpEventType.UploadProgress:
                this.progress = Math.round(event.loaded / event.total * 100)
                console.log(`Uploaded! ${this.progress}%`)
                break;
              case HttpEventType.Response:
                this.ngOnInit()
                setTimeout(() => {
                  this.progress = 0
                }, 1500)
            }
          })
      } catch (e) {
        console.log(e)
      }
    }
  }

}
