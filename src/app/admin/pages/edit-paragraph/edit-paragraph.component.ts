import { Component, OnInit, Inject } from '@angular/core';
import { AdminService } from '../../../services/admin.service'
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-paragraph',
  templateUrl: './edit-paragraph.component.html',
  styleUrls: ['./edit-paragraph.component.scss']
})
export class EditParagraphComponent implements OnInit {

  public content: string

  constructor(
    private dialogRef: MatDialogRef<EditParagraphComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public api: AdminService
  ) { }

  ngOnInit() {
    
  }

  async updateParagraph() {
    if (this.data.content) {
      try {
        this.data.section.content[this.data.paragraphIndex] = this.data.content
        const { title, order, side, content } = this.data.section
        const newSection = await this.api.updateSection(
          { sectionId: this.data.section._id },
          { title, order, side, content }
        )
        console.log(newSection)
        this.dialogRef.close()
      } catch (e) {
        console.log(e)
      }
    }
  }

}
