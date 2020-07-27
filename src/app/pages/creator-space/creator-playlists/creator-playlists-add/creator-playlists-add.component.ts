import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { MatDialogRef } from '@angular/material/dialog';
import { CreatorSpaceService } from '../../creator-space.service';

@Component({
  selector: 'app-creator-playlists-add',
  templateUrl: './creator-playlists-add.component.html',
  styleUrls: ['./creator-playlists-add.component.scss']
})
export class CreatorPlaylistsAddComponent implements OnInit {

  public addPlaylistForm: FormGroup
  public isCreating: boolean = false
  public isCreated: boolean = false

  constructor(
    private creatorSpaceService: CreatorSpaceService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreatorPlaylistsAddComponent>
  ) { }

  ngOnInit() {
    this.addPlaylistForm = this.fb.group({
      title: [null, Validators.required],
      description: [null, Validators.required],
      status: [null]
    })
  }

  async addPlaylist() {
    try {
      if (this.addPlaylistForm.valid) {
        this.isCreating = true
        const { title, description, status } = this.addPlaylistForm.value
        const playlist = await this.creatorSpaceService.createPlaylist({ title, description, status })
        if (playlist) {
          this.isCreating = false
          this.isCreated = true
          setTimeout(() => {
            this.dialogRef.close()
          }, 1000)
        }
      }
    } catch (e) {
      console.log(e)
    }
  }

}
