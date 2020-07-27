import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.service'

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit {

  public uniqueName: string = 'privacyPolicy'
  public page: any
  public sections: any
  public rightSections: any
  public leftSections: any

  constructor(
    public api: AdminService
  ) { }

  async ngOnInit() {
    const page = await this.api.getPages(this.uniqueName)
    this.page = page[0]
    console.log(this.page)
    const $page = await this.api.getSections({ pageId: this.page._id })
    this.rightSections = $page.sections.filter(section => section.side == 'right' ? false : true)
    this.leftSections = $page.sections.filter(section => section.side == 'left' ? false : true)

    console.log(this.rightSections)
    console.log(this.leftSections)
  }

}
