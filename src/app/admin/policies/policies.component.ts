import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-policies',
  templateUrl: './policies.component.html',
  styleUrls: ['./policies.component.scss']
})
export class PoliciesComponent implements OnInit {

  @ViewChild('fileInput', { static: false }) fileInput: ElementRef
  files: any = [];
  public progress: number = 0

  constructor(private adminService: AdminService, private snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  stageFiles(event) {
    for (let index = 0; index < event.length; index++) {
      const element = event[index];
      if (this.checkPolicyName(element.name)) {
        const file = { title: element.name, createdAt: Date.now, pdf: element }
        this.files.push(file)
      } else {
        this.files.splice(index, 1)
        this.snackBar.open('Invalid file name!', null, { duration: 2000 })
      }
    }
  }

  deleteAttachment(index) {
    this.files.splice(index, 1)
  }

  public async uploadFiles() {
    this.files.forEach(async (file) => {
      await this.uploadFile(file)
    });
  }

  public async uploadFile(file) {
    const fileName = file.title
    const fileType = file.pdf.type
    try {
      const url = await this.adminService.getUploadURL({ fileName, fileType, bucketName: 'legal' })
      this.adminService.uploadFile(file.pdf, url.url)
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
        await this.adminService.createLegalDoc({ title: file.title, createdAt: file.createdAt, pdf: url.url })
        this.files.splice(0, this.files.length)
        this.snackBar.open('Upload successful!', null, { duration: 2000 })
    } catch (e) {
      console.log(e)
    }
  }

  checkPolicyName(fileName) {
    var isValidFile = false
    switch (fileName) {
      case 'privacy.pdf':
      case 'terms.pdf':
      case 'cookie.pdf':
      case 'copyright.pdf':
      case 'gdpr.pdf':
        isValidFile = true;
        break;
      default:
        isValidFile = false
    }
    return isValidFile
  }
}
