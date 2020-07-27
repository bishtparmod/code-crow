import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { AddParagraphComponent } from './add-paragraph/add-paragraph.component'
import { AddSectionComponent } from './add-section/add-section.component'
import { EditParagraphComponent } from './edit-paragraph/edit-paragraph.component'

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {

  public pages: any[]
  public page: any
  public pageSections: any

  public isLoadingPages: boolean = true
  public isLoadingPageSection: boolean = false
  public leftSections: any[] = []
  public rightSections: any[] = []

  constructor(
    private api: AdminService,
    private dialog: MatDialog
  ) { }

  async ngOnInit() {
    try {
      const pages = await this.api.getPages()
      this.isLoadingPages = false
      this.pages = pages
    } catch (e) {
      console.log(e)
    }
  }

  public async viewPage(pageId) {
    try {
      this.isLoadingPageSection = true
      const page = await this.api.getSections({ pageId })
      this.page = page
      this.rightSections = this.page.sections.filter(section => section.side == 'right' ? false : true).map(section => ({ ...section, minimize: true, newtitle: section.title, editingTitle: false }))
      this.leftSections = this.page.sections.filter(section => section.side == 'left' ? false : true).map(section => ({ ...section, minimize: true, newtitle: section.title, editingTitle: false }))
      this.isLoadingPageSection = false
    } catch (e) {
      console.log(e)
    }
  }

  minimize(section) {
    section.minimize = !section.minimize
  }

  editTitle(section) {
    section.editingTitle = !section.editingTitle
  }

  async saveTitle(section) {
    try {
      const { order, content, side, _id } = section
      const title = section.newtitle
      const updateSection = await this.api.updateSection({ sectionId: _id }, { title, order, content, side })
      section.title = title
      console.log(updateSection)
      this.editTitle(section)
    } catch (e) {

    }
  }

  addParagraph(section) {
    this.dialog.open(AddParagraphComponent, {
      width: '600px',
      data: section
    })
  }

  addSection() {
    this.dialog.open(AddSectionComponent, {
      width: '600px',
      data: this.page._id
    })
      .afterClosed()
      .subscribe(data => {
        this.ngOnInit()
      })
  }

  editParagraph(section, paragraphIndex, content) {
    this.dialog.open(EditParagraphComponent, {
      data: {
        section, paragraphIndex, content
      },
      width: '600px'
    })
  }

  async drop(event: CdkDragDrop<string[]>) {
    console.log(event)
    const sectionContent = event.item.element.nativeElement.innerText
    const sectionTitle = sectionContent.substr(0, sectionContent.match(/[a-z]/).index - 1)

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex)
      const section: any = event.container.data.filter((s: any) => s.title == sectionTitle ? true : false)[0]
      section.order = event.currentIndex
      const { title, order, content, side, _id } = section
      const update = await this.api.updateSection({ sectionId: _id }, { title, order, content, side })
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex)

      const sideClassName = event.container.element.nativeElement.classList[0]
      const side = sideClassName.substr(0, sideClassName.indexOf('S')) == 'right' ? 'left' : 'right'
      console.log('>> GOING TO', side)
      const order = event.currentIndex
      const section: any = event.container.data[order]
      const { content, _id, title } = section
      const update = await this.api.updateSection({ sectionId: _id }, { side, order, content, title })
      console.log(update)
    }
  }

  dropParagraph(event: CdkDragDrop<string[]>, arr) {
    moveItemInArray(arr, event.previousIndex, event.currentIndex);
  }

}
