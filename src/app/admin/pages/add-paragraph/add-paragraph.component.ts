import { Component, OnInit, Inject } from '@angular/core';
import { AdminService } from '../../../services/admin.service'
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

interface Section {
  title: string;
  _id: string;
  content: Array<String>;
  side: string;
  order: string;
}
@Component({
  selector: 'app-add-paragraph',
  templateUrl: './add-paragraph.component.html',
  styleUrls: ['./add-paragraph.component.scss']
})
export class AddParagraphComponent implements OnInit {

  public sectionId: any
  public content: string

  constructor(
    private dialogRef: MatDialogRef<AddParagraphComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Section,
    public api: AdminService
  ) { }

  ngOnInit() {
    this.sectionId = this.data._id
  }

  async addSection() {
    if (this.content) {
      this.data.content.push(this.content)
      const { content, title, order, side } = this.data
      const newParagraph = await this.api.updateSection({ sectionId: this.sectionId }, {
        title,
        order,
        content,
        side
      })
      this.dialogRef.close()
    }
  }
}
