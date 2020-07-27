import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { routes } from './admin-routing';
import { AdminComponent } from './admin.component';
import { OnlyAdminUsersGuard } from './admin-user-guard';
import { SidebarComponent } from './sidebar/sidebar.component';
import { InsightsComponent } from './insights/insights.component';
import { SharedModule } from '../shared/shared.module';
import { BriefAnalyticsComponent } from './insights/brief-analytics/brief-analytics.component';
import { TrafficComponent } from './insights/traffic/traffic.component';
import { TrafficAnalyticsComponent } from './insights/traffic-analytics/traffic-analytics.component';
import { UsersComponent } from './users/users.component';
import { ChannelsComponent } from './channels/channels.component';
import { PagesComponent } from './pages/pages.component';
import { AddParagraphComponent } from './pages/add-paragraph/add-paragraph.component';
import { AddSectionComponent } from './pages/add-section/add-section.component';
import { EditParagraphComponent } from './pages/edit-paragraph/edit-paragraph.component';
import { LiveStreamingComponent } from './live-streaming/live-streaming.component';
import { PaymentsComponent } from './payments/payments.component';
import { ProductsComponent } from './payments/products/products.component';
import { PlansComponent } from './payments/plans/plans.component';
import { SubscriptionsComponent } from './payments/subscriptions/subscriptions.component';
import { ChargesComponent } from './payments/charges/charges.component';
import { RefundsComponent } from './payments/refunds/refunds.component';
import { RefundConfirmComponent } from './payments/charges/refund-confirm/refund-confirm.component';
import { ProductDetailsComponent } from './payments/products/details/details.component';
import { AddProductComponent } from './payments/products/add-product/add-product.component';
import { AddPlanComponent } from './payments/plans/add-plan/add-plan.component';
import { NewsComponent } from './news/news.component';
import { CreateNewsComponent } from './news/create-news/create-news.component';
import { InsightsNewsComponent } from './news/insights-news/insights-news.component';
import { VideosComponent } from './videos/videos.component';
import { AdminVideoInsightsComponent } from './videos/admin-video-insights/admin-video-insights.component';
import { AdminVideoStatisticsComponent } from './videos/admin-video-statistics/admin-video-statistics.component';
import { AdminVideoTableComponent } from './videos/admin-video-table/admin-video-table.component';
import { CKEditorModule } from 'ng2-ckeditor';
import { NewsImagesComponent } from './news/news-images/news-images.component';
import { SiteSettingsComponent } from './site-settings/site-settings.component';
import { MaintenanceSettingsComponent } from './site-settings/maintenance-settings/maintenance-settings.component';
import { AdminsComponent } from './admins/admins.component';
import { AddAdminComponent } from './admins/add-admin/add-admin.component';
import { PoliciesComponent } from './policies/policies.component';
import { DragDropDirective } from '../directives/drag-drop.directive';
import { AddVariationComponent } from './payments/products/add-variation/add-variation.component';
import { ListVariantsComponent } from './payments/products/list-variants/list-variants.component';
import { ListProductsComponent } from './payments/products/list-products/list-products.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';

@NgModule({
  declarations: [
    AdminComponent,
    SidebarComponent,
    InsightsComponent,
    BriefAnalyticsComponent,
    TrafficComponent,
    TrafficAnalyticsComponent,
    UsersComponent,
    ChannelsComponent,
    PagesComponent,
    AddParagraphComponent,
    AddSectionComponent,
    EditParagraphComponent,
    LiveStreamingComponent,
    PaymentsComponent,
    ProductsComponent,
    PlansComponent,
    SubscriptionsComponent,
    ChargesComponent,
    RefundsComponent,
    RefundConfirmComponent,
    ProductDetailsComponent,
    AddProductComponent,
    AddPlanComponent,
    NewsComponent,
    CreateNewsComponent,
    InsightsNewsComponent,
    VideosComponent,
    AdminVideoInsightsComponent,
    AdminVideoStatisticsComponent,
    AdminVideoTableComponent,
    NewsImagesComponent,
    SiteSettingsComponent,
    MaintenanceSettingsComponent,
    AdminsComponent,
    AddAdminComponent,
    PoliciesComponent,
    DragDropDirective,
    AddVariationComponent,
    ListVariantsComponent,
    ListProductsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    CKEditorModule,
    MatSnackBarModule
  ],
  entryComponents: [
    AddParagraphComponent,
    AddSectionComponent,
    EditParagraphComponent,
    RefundConfirmComponent,
    ProductDetailsComponent,
    AddProductComponent,
    AddPlanComponent,
    AddAdminComponent,
    AddVariationComponent,
    ListVariantsComponent
  ],
  providers: [
    OnlyAdminUsersGuard
  ],
  bootstrap: [AdminComponent]
})
export class AdminModule { }
