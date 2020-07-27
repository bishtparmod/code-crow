import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import * as moment from 'moment';
import * as _ from 'lodash';
import { CreatorSpaceService } from '../creator-space.service';
import { ChatService } from '../../../services/chat.service';
import { TokenStorage } from '../../../auth/token.storage'

@Component({
  selector: 'app-creator-playlists',
  templateUrl: './creator-playlists.component.html',
  styleUrls: ['./creator-playlists.component.scss']
})
export class CreatorPlaylistsComponent implements OnInit {

  constructor(
    public creatorSpaceService: CreatorSpaceService
  ) { }

  ngOnInit() {
    
  }

  addPlaylist() {

  }

}
