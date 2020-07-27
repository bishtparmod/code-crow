import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.service'

@Component({
  selector: 'app-copyright-policy',
  templateUrl: './copyright-policy.component.html',
  styleUrls: ['./copyright-policy.component.scss']
})
export class CopyrightPolicyComponent implements OnInit {

  public uniqueName: string = 'copyrightPolicy'
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

    const $page = await this.api.getSections({ pageId: this.page._id })
    this.rightSections = $page.sections.filter(section => section.side == 'right' ? false : true)
    this.leftSections = $page.sections.filter(section => section.side == 'left' ? false : true)

    console.log(this.rightSections)
    console.log(this.leftSections)
  }

}
