import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { routes } from './creator-space.routing'
import { SharedModule } from '../../shared/shared.module'

import { CreatorSpaceComponent } from './creator-space.component'
import { CreatorInsightsComponent } from './creator-insights/creator-insights.component'
import { CreatorChannelsComponent } from './creator-channels/creator-channels.component'
import { CreatorVideosComponent } from './creator-videos/creator-videos.component'
import { CreatorPlaylistsComponent } from './creator-playlists/creator-playlists.component'
import { CreatorPaymentsComponent } from './creator-payments/creator-payments.component'
import { CreatorSidenavComponent } from './creator-sidenav/creator-sidenav.component'
import { CreatorLiveStreamingComponent } from './creator-live-streaming/creator-live-streaming.component';
import { CreatorPlaylistsListingComponent } from './creator-playlists/creator-playlists-listing/creator-playlists-listing.component';
import { CreatorPlaylistsAddComponent } from './creator-playlists/creator-playlists-add/creator-playlists-add.component';
import { CreatorPlaylistsDetailsComponent } from './creator-playlists/creator-playlists-details/creator-playlists-details.component';
import { CreatorPlaylistsStatisticsComponent } from './creator-playlists/creator-playlists-statistics/creator-playlists-statistics.component';
import { CreatorPlaylistsVideoItemComponent } from './creator-playlists/creator-playlists-details/creator-playlists-video-item/creator-playlists-video-item.component';
import { CreatorVideosInsightsComponent } from './creator-videos/creator-videos-insights/creator-videos-insights.component';
import { CreatorVideosStatisticsComponent } from './creator-videos/creator-videos-statistics/creator-videos-statistics.component';
import { CreatorVideosTableComponent } from './creator-videos/creator-videos-table/creator-videos-table.component';
import { CreatorVideosViewersComponent } from './creator-videos/creator-videos-viewers/creator-videos-viewers.component'

@NgModule({
  declarations: [
    CreatorSpaceComponent,
    CreatorInsightsComponent,
    CreatorChannelsComponent,
    CreatorVideosComponent,
    CreatorPlaylistsComponent,
    CreatorPaymentsComponent,
    CreatorSidenavComponent,
    CreatorLiveStreamingComponent,
    CreatorPlaylistsListingComponent,
    CreatorPlaylistsAddComponent,
    CreatorPlaylistsDetailsComponent,
    CreatorPlaylistsStatisticsComponent,
    CreatorPlaylistsVideoItemComponent,
    CreatorVideosInsightsComponent,
    CreatorVideosStatisticsComponent,
    CreatorVideosTableComponent,
    CreatorVideosViewersComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  entryComponents: [
    CreatorPlaylistsAddComponent
  ],
  bootstrap: [CreatorSpaceComponent]
})
export class CreatorSpaceModule { }