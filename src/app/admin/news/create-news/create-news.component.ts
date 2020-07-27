import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { AdminService } from '../../../services/admin.service'
import {
  DomSanitizer,
  SafeHtml,
  SafeUrl,
  SafeStyle
} from '@angular/platform-browser';

@Component({
  selector: 'app-create-news',
  templateUrl: './create-news.component.html',
  styleUrls: ['./create-news.component.scss']
})
export class CreateNewsComponent implements OnInit {
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef
  public defaultBGURL: SafeStyle = 'url("../../../../assets/placeholder.png")'
  public title: string
  public message: string
  public body: string
  public thumbnail: string
  public file: File
  public isLoading: Boolean

  ckeConfig: any;
  @ViewChild("myckeditor", { static: false }) ckeditor: any;

  constructor(
    private adminService: AdminService,
    private sanitization: DomSanitizer
  ) { }

  ngOnInit() {
    this.ckeConfig = {
      allowedContent: false,
      forcePasteAsPlainText: true,
      font_names: 'Arial;Times New Roman;Verdana',
      toolbarGroups: [
        { name: 'document', groups: ['mode', 'document', 'doctools'] },
        { name: 'clipboard', groups: ['clipboard', 'undo'] },
        { name: 'editing', groups: ['find', 'selection', 'spellchecker', 'editing'] },
        { name: 'forms', groups: ['forms'] },
        '/',
        { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
        { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi', 'paragraph'] },
        { name: 'links', groups: ['links'] },
        { name: 'insert', groups: ['insert'] },
        '/',
        { name: 'styles', groups: ['styles'] },
        { name: 'colors', groups: ['colors'] },
        { name: 'tools', groups: ['tools'] },
        { name: 'others', groups: ['others'] },
        { name: 'about', groups: ['about'] }
      ],
      removeButtons: 'Save,NewPage,Preview,Print,Source,Templates,Cut,Copy,Paste,PasteText,PasteFromWord,Find,Replace,Scayt,SelectAll,Form,Checkbox,Radio,TextField,HiddenField,ImageButton,Button,Select,Textarea,Flash,Iframe,About,BidiLtr,BidiRtl,Language,Anchor,Unlink,Link,PageBreak,SpecialChar,Smiley'
    };
  }

  async createAnnouncment() {
    const { title, message, body } = this
    try {
      console.log({ title, message, body })
      if (title && message && body) {
        this.isLoading = true
        const announcement = await this.adminService.createNewsAnnouncement({ title, message, body, thumbnail: this.thumbnail })
        this.defaultBGURL = this.sanitization.bypassSecurityTrustStyle(`url("${announcement.image}")`)
        this.title = ''
        this.message = ''
        this.isLoading = false
      }
    } catch (e) {
      this.isLoading = false
      console.log(e)
    }
  }

  public selectBackground() {
    this.fileInput.nativeElement.click()
  }

  public changeBackground($event) {
    if ($event.target.files.length > 0) {
      this.file = $event.target.files[0]
      this.defaultBGURL = this.sanitization.bypassSecurityTrustStyle(`url("${this.fileInput.nativeElement.value}")`)
    }
  }

  public onChange({ editor }) {
    this.body = editor.getData()
  }

}
