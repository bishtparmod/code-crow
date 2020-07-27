import { MaintenanceGuard } from './../auth/maintenance-guard.service';
import { ContactComponent } from './../pages/contact/contact.component';
import { LegalComponent } from '../pages/legal/legal.component';
import { AboutComponent } from './../pages/about/about.component';
import { VideosComponent } from './../pages/videos/videos.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth-guard.service';
import { HomeComponent } from '../home/home.component';
import { PricingComponent } from '../pages/pricing/pricing.component';
import { CheckoutComponent } from '../pages/checkout/checkout.component';
import { PurchaseComponent } from '../pages/purchase/purchase.component';
import { AdblockComponent } from '../pages/adblock/adblock.component';
import { PaymentMethodsComponent } from '../pages/settings/payment-methods/payment-methods.component';
import { VideoPlayerComponent } from '../pages/videos/video-player/video-player.component'
import { MaintenanceComponent } from '../pages/maintenance/maintenance.component';
import { NotFoundComponent } from '../pages/not-found/not-found.component';
import { ChannelsComponent } from '../pages/channels/channels.component'

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        component: ChannelsComponent
      },
      {
        path: "channel/:channelId",
        component: HomeComponent
      }
    ],
    canActivate: [AuthGuard, MaintenanceGuard]
  },
  { path: '404', component: NotFoundComponent },
  // {
  //   path: 'disable-ad-block',
  //   component: AdblockComponent
  // },
  {
    path: 'maintenance',
    component: MaintenanceComponent
  },
  {
    path: 'auth',
    loadChildren: 'app/auth/auth.module#AuthModule',
  },
  {
    path: 'admin',
    loadChildren: 'app/admin/admin.module#AdminModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'creator-space',
    loadChildren: 'app/pages/creator-space/creator-space.module#CreatorSpaceModule',
    canActivate: [AuthGuard, MaintenanceGuard]
  },
  {
    path: 'legal',
    loadChildren: 'app/pages/legal/legal.module#LegalModule',
  },
  {
    path: 'pricing',
    component: PricingComponent,
    canActivate: [MaintenanceGuard]
  },
  {
    path: 'videos',
    component: VideosComponent,
    canActivate: [AuthGuard, MaintenanceGuard]
  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'legal',
    component: LegalComponent
  },
  {
    path: 'contact',
    component: ContactComponent
  },
  {
    path: 'settings',
    children: [
      // {
      //   path: '',
      //   component: AccountSettingsComponent
      // },
      {
        path: '',
        component: PaymentMethodsComponent
      },
      {
        path: 'payment-methods',
        component: PaymentMethodsComponent
      },
      // {
      //   path: 'notifications',
      //   component: NotificationsSettingsComponent
      // },
      // {
      //   path: 'profile',
      //   component: ProfileSettingsComponent
      // }
    ],
    canActivate: [AuthGuard, MaintenanceGuard]
  },
  {
    path: 'checkout/:planId',
    component: CheckoutComponent
  },
  {
    path: 'purchase/:skuId',
    component: PurchaseComponent
  },
  {
    path: 'video/:id',
    component: VideoPlayerComponent,
    canActivate: [AuthGuard, MaintenanceGuard]
  },
  { path: '**', redirectTo: '404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard, MaintenanceGuard],
  declarations: []
})

export class AppRoutingModule { }
