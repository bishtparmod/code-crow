import { Routes } from '@angular/router'
import { AuthGuard } from '../../auth/auth-guard.service';

import { CreatorInsightsComponent } from './creator-insights/creator-insights.component'
import { CreatorChannelsComponent } from './creator-channels/creator-channels.component'
import { CreatorVideosComponent } from './creator-videos/creator-videos.component'
import { CreatorPlaylistsComponent } from './creator-playlists/creator-playlists.component'
import { CreatorPaymentsComponent } from './creator-payments/creator-payments.component'
import { CreatorLiveStreamingComponent } from './creator-live-streaming/creator-live-streaming.component'

export const routes: Routes = [{
  path: '',
  children: [
    {
      path: '',
      component: CreatorVideosComponent,
      canActivate: [AuthGuard]
    },
    {
      path: 'channels',
      component: CreatorChannelsComponent,
      canActivate: [AuthGuard]
    },
    {
      path: 'videos',
      component: CreatorVideosComponent,
      canActivate: [AuthGuard]
    },
    {
      path: 'playlists',
      component: CreatorPlaylistsComponent,
      canActivate: [AuthGuard]
    },
    {
      path: 'live-streaming',
      component: CreatorLiveStreamingComponent,
      canActivate: [AuthGuard]
    },
    {
      path: 'payments',
      component: CreatorPaymentsComponent,
      canActivate: [AuthGuard]
    }
  ]
}]
