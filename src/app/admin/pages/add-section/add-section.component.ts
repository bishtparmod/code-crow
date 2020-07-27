import { Component, OnInit, Inject } from '@angular/core';
import { AdminService } from '../../../services/admin.service'
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-add-section',
  templateUrl: './add-section.component.html',
  styleUrls: ['./add-section.component.scss']
})
export class AddSectionComponent implements OnInit {

  public side: string
  public title: string

  constructor(
    private dialogRef: MatDialogRef<AddSectionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public api: AdminService
  ) { }

  ngOnInit() {
  }

  async addSection() {
    if (this.side && this.title) {
      try {
        const addSection = await this.api.addSection({ pageId: this.data }, { title: this.title, side: this.side, order: 0, content: [] })
        this.dialogRef.close()
      } catch (e) {
        console.log(e)
      }
    }
  }
}
