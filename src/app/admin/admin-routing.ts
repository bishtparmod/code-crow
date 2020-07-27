import { Routes } from '@angular/router';

import { AdminsComponent } from './admins/admins.component';
import { OnlyAdminUsersGuard } from './admin-user-guard';
import { AuthGuard } from '../auth/auth-guard.service';
import { InsightsComponent } from './insights/insights.component';
import { PagesComponent } from './pages/pages.component'
import { UsersComponent } from './users/users.component'
import { ChannelsComponent } from './channels/channels.component';
import { LiveStreamingComponent } from './live-streaming/live-streaming.component';
import { PaymentsComponent } from './payments/payments.component';
import { NewsComponent } from './news/news.component';
import { VideosComponent } from './videos/videos.component';
import { SiteSettingsComponent } from './site-settings/site-settings.component';
import { PoliciesComponent } from './policies/policies.component';

export const routes: Routes = [{
  path: '',
  canActivate: [AuthGuard, OnlyAdminUsersGuard],
  children: [
    {
      path: '',
      component: InsightsComponent,
      canActivate: [AuthGuard, OnlyAdminUsersGuard]
    },
    {
      path: 'admins',
      component: AdminsComponent,
      canActivate: [AuthGuard, OnlyAdminUsersGuard]
    },
    {
      path: 'users',
      component: UsersComponent,
      canActivate: [AuthGuard, OnlyAdminUsersGuard]
    },
    {
      path: 'channels',
      component: ChannelsComponent,
      canActivate: [AuthGuard, OnlyAdminUsersGuard]
    },
    {
      path: 'pages',
      component: PagesComponent,
      canActivate: [AuthGuard, OnlyAdminUsersGuard]
    },
    {
      path: 'live-streaming',
      component: LiveStreamingComponent,
      canActivate: [AuthGuard, OnlyAdminUsersGuard]
    },
    {
      path: 'videos',
      component: VideosComponent,
      canActivate: [AuthGuard, OnlyAdminUsersGuard]
    },
    {
      path: 'policies',
      component: PoliciesComponent,
      canActivate: [AuthGuard, OnlyAdminUsersGuard]
    },
    {
      path: 'payments',
      component: PaymentsComponent,
      canActivate: [AuthGuard, OnlyAdminUsersGuard]
    },
    {
      path: 'news',
      component: NewsComponent,
      canActivate: [AuthGuard, OnlyAdminUsersGuard]
    },
    {
      path: 'site-settings',
      component: SiteSettingsComponent,
      canActivate: [AuthGuard, OnlyAdminUsersGuard]
    }
  ]
}]

