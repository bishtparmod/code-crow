import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatRippleModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './auth/auth.module';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import { AppComponent, FormatTimePipe } from './app.component';
import { AuthHeaderInterceptor } from './interceptors/header.interceptor';
import { CatchErrorInterceptor } from './interceptors/http-error.interceptor';

import { AppRoutingModule } from './app-routing/app-routing.module';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { ContentComponent } from './home/content/content.component';
import { ChatComponent } from './home/chat/chat.component';
import { MessageComponent } from './home/chat/message/message.component';
import { InputComponent } from './home/chat/input/input.component';
import { FooterComponent } from './home/footer/footer.component';
import { ViewComponent } from './home/footer/view/view.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChannelComponent } from './home/channel/channel.component';
import { ChannelItemComponent } from './home/channel/channel-item/channel-item.component';
import { FilterPipe } from './filter.pipe';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { SidenavListComponent } from './header/sidenav-list/sidenav-list.component';

import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';

import { AddChannelComponent } from './home/channel/add-channel/add-channel.component';
import { LoginComponent } from './auth/login/login.component';
import { ExitChannelComponent } from './home/channel/exit-channel/exit-channel.component';
import { OwnerExitComponent } from './home/channel/owner-exit/owner-exit.component';


import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { SettingsComponent } from './pages/settings/settings.component';
import { VideosComponent } from './pages/videos/videos.component';
import { VideoItemComponent } from './pages/videos/video-item/video-item.component';
import { ChannelSettingsComponent } from './home/channel/channel-settings/channel-settings.component';
import { BlockWarningComponent } from './home/channel/block-warning/block-warning.component';
import { VideoComponent } from './home/channel/video/video.component';
import { ResizableModule } from 'angular-resizable-element';

import { LegalModule } from './pages/legal/legal.module';
import { CookiePolicyComponent } from './pages/legal/cookie-policy/cookie-policy.component';
import { PrivacyPolicyComponent } from './pages/legal/privacy-policy/privacy-policy.component';
import { TermsOfServiceComponent } from './pages/legal/terms-of-service/terms-of-service.component';
import { CopyrightPolicyComponent } from './pages/legal/copyright-policy/copyright-policy.component';
import { LegalComponent } from './pages/legal/legal.component';
import { DialogComponent } from './controls/dialog/dialog.component';
import { DialogService } from './services/dialog.service';
import { PricingComponent } from './pages/pricing/pricing.component';
import { PricingTiersComponent } from './pages/pricing/pricing-tiers/pricing-tiers.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FriendsComponent } from './pages/friends/friends.component';
import { FriendItemComponent } from './pages/friends/friend-item/friend-item.component';
import { FriendChatComponent } from './pages/friends/friend-chat/friend-chat.component';
import { GdprPolicyComponent } from './pages/legal/gdpr-policy/gdpr-policy.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { Module as StripeModule } from "stripe-angular";
import { AddPaymentMethodComponent } from './pages/checkout/add-payment-method/add-payment-method.component';
import { SubcancelComponent } from './pages/pricing/subcancel/subcancel.component';
import { FeatureFlagDirective } from './directives/feature-flag.directive';
import { DonateDialogComponent } from './home/chat/donate-dialog/donate-dialog.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { NotificationsSettingsComponent } from './pages/settings/notifications-settings/notifications-settings.component';
import { ProfileSettingsComponent } from './pages/settings/profile-settings/profile-settings.component';
import { AccountSettingsComponent } from './pages/settings/account-settings/account-settings.component';
import { PaymentMethodsComponent } from './pages/settings/payment-methods/payment-methods.component';
import { SideNavComponent } from './pages/settings/side-nav/side-nav.component';
import { FriendsMenuOne, FriendsMenuTwo, FriendsMenuThree, FriendsMenuFour, FriendsMenuFive } from './pages/friends/friends-menus/friends-menus.component';
import { NewsComponent } from './pages/news/news.component';
import { NewsItemComponent } from './pages/news/news-item/news-item.component';
import { NewsDialogComponent } from './pages/news/news-dialog/news-dialog.component';
import { AdblockComponent } from './pages/adblock/adblock.component';
import { StreamComponent } from './home/channel/stream/stream.component';

import { VgCoreModule } from 'videogular2/compiled/core'
import { VgControlsModule } from 'videogular2/compiled/controls'
import { VgOverlayPlayModule } from 'videogular2/compiled/overlay-play'
import { VgBufferingModule } from 'videogular2/compiled/buffering';
import { VideoPlayerComponent } from './pages/videos/video-player/video-player.component';
import { StreamControlsComponent } from './home/content/stream-controls/stream-controls.component'
import { CreatorPlaylistsVideoItemComponent } from './pages/creator-space/creator-playlists/creator-playlists-details/creator-playlists-video-item/creator-playlists-video-item.component';
import { MaintenanceComponent } from './pages/maintenance/maintenance.component';
import { AccountSubsComponent } from './pages/settings/payment-methods/account-subs/account-subs.component';
import { AccountCardsComponent } from './pages/settings/payment-methods/account-cards/account-cards.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { CreateGroupComponent } from './pages/friends/create-group/create-group.component';
import { FriendGroupItemComponent } from './pages/friends/friend-group-item/friend-group-item.component'
import { LoadingDialogComponent } from './controls/loading-dialog/loading-dialog.component';
import { VideoPartItemComponent } from './home/content/stream-controls/video-part-item/video-part-item.component';
import { UnsavedVideoPartsComponent } from './home/content/stream-controls/unsaved-video-parts/unsaved-video-parts.component';
import { SubscriptionsComponent } from './pages/pricing/subscriptions/subscriptions.component';
import { PackagesComponent } from './pages/pricing/packages/packages.component';
import { PackageTierComponent } from './pages/pricing/package-tier/package-tier.component';
import { PurchaseComponent } from './pages/purchase/purchase.component';
import { ChannelListComponent } from './home/channel-list/channel-list.component';
import { ChannelsComponent } from './pages/channels/channels.component';


@NgModule({
  declarations: [
    AppComponent,
    FormatTimePipe,
    HeaderComponent,
    HomeComponent,
    ContentComponent,
    MessageComponent,
    InputComponent,
    ChatComponent,
    FooterComponent,
    ViewComponent,
    ChannelComponent,
    ChannelItemComponent,
    FilterPipe,
    SidenavListComponent,
    AboutComponent,
    AddChannelComponent,
    LoginComponent,
    ExitChannelComponent,
    OwnerExitComponent,
    ChannelSettingsComponent,
    BlockWarningComponent,
    VideoComponent,
    CookiePolicyComponent,
    PrivacyPolicyComponent,
    TermsOfServiceComponent,
    CopyrightPolicyComponent,
    GdprPolicyComponent,
    ContactComponent,
    VideoItemComponent,
    VideosComponent,
    LegalComponent,
    SettingsComponent,
    DialogComponent,
    PricingComponent,
    PricingTiersComponent,
    FriendsComponent,
    FriendItemComponent,
    FriendChatComponent,
    FeatureFlagDirective,
    DonateDialogComponent,
    CheckoutComponent,
    AddPaymentMethodComponent,
    SubcancelComponent,
    NotificationsSettingsComponent,
    ProfileSettingsComponent,
    AccountSettingsComponent,
    PaymentMethodsComponent,
    SideNavComponent,
    FriendsMenuOne, FriendsMenuTwo, FriendsMenuThree, FriendsMenuFour, FriendsMenuFive,
    NewsComponent, NewsItemComponent, NewsDialogComponent,
    AdblockComponent, StreamComponent, VideoPlayerComponent, StreamControlsComponent, MaintenanceComponent, AccountSubsComponent, AccountCardsComponent,
    NotFoundComponent,
    CreateGroupComponent,
    FriendGroupItemComponent,
    LoadingDialogComponent,
    VideoPartItemComponent,
    UnsavedVideoPartsComponent,
    SubscriptionsComponent,
    PackagesComponent,
    PackageTierComponent,
    PurchaseComponent,
    ChannelListComponent,
    ChannelsComponent,
    // CreatorPlaylistsVideoItemComponent
  ],
  imports: [
    PickerModule,
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule,
    AuthModule,
    LegalModule,
    RouterModule,
    AppRoutingModule,
    MDBBootstrapModule.forRoot(),
    MatListModule,
    MatRippleModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    ResizableModule,
    OverlayModule,
    StripeModule.forRoot(),
    CKEditorModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule
  ],
  exports: [
    AddChannelComponent,
    CreateGroupComponent
  ],
  providers: [
    DialogService, {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHeaderInterceptor,
      multi: true,
    }, {
      provide: HTTP_INTERCEPTORS,
      useClass: CatchErrorInterceptor,
      multi: true,
    }],
  entryComponents: [
    AddChannelComponent,
    ExitChannelComponent,
    OwnerExitComponent,
    ChannelSettingsComponent,
    BlockWarningComponent,
    DialogComponent,
    DonateDialogComponent,
    AddPaymentMethodComponent,
    SubcancelComponent,
    StreamComponent,
    NewsDialogComponent,
    CreateGroupComponent,
    LoadingDialogComponent,
    UnsavedVideoPartsComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }