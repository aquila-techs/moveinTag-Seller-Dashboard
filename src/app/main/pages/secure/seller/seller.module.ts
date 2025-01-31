import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";

import { CoreCommonModule } from "@core/common.module";
import { ContentHeaderModule } from "app/layout/components/content-header/content-header.module";
import { RouterModule, Routes } from "@angular/router";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { AuthGuard } from "@core/guards/auth.guards";
import { NgApexchartsModule } from "ng-apexcharts";
import { DashboardService } from "@core/services/services/dashboard.service";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { CardSnippetModule } from "@core/components/card-snippet/card-snippet.module";
import { NouisliderModule } from "ng2-nouislider";
import { CoreSidebarModule } from "@core/components";
import { CoreTouchspinModule } from "@core/components/core-touchspin/core-touchspin.module";
import {
  SwiperConfigInterface,
  SwiperModule,
  SWIPER_CONFIG,
} from "ngx-swiper-wrapper";
import { FileUploadModule } from "ng2-file-upload";
import { Ng2FlatpickrModule } from "ng2-flatpickr";
import { ChartsModule } from "ng2-charts";
import { ProfileComponent } from "./profile/profile.component";
import { ImageCropperModule } from "ngx-image-cropper";
import { HomeComponent } from "./home/home.component";
import { OrdermanagementComponent } from "./order-management/ordermanagement.component";
import { CustomerlistingsComponent } from "./customer-listing/customerlistings.component";
import { EarningsComponent } from "./earnings/earnings.component";
import { VerificationsComponent } from "./verifications/verifications.component";
import { RefferalsComponent } from "./refferals/refferals.component";
import { SettingsComponent } from "./settings/settings.component";
import { ClipboardModule } from "ngx-clipboard";
import { GoogleMapsModule } from "@angular/google-maps";
import { ChatComponent } from "./chat/chat.component";

import { Checkout1Component } from "./checkout1/checkout1.component";
import { ActiveSubscription } from "./active-subscription/active-subscription.component";
import { PaymentComponent } from "./payment/payment.component";
import { ReviewComponent } from "./review/review.component";
import { ContactComponent } from "./contact/contact.component";
import { SubscriptionRenewelComponent } from "./subscription-renewel/subscription-renewel.component";
import { ChangePasswordComponent } from "./change-password/change-password.component";

const routes: Routes = [
  {
    path: "dashboard",
    canActivate: [AuthGuard],
    component: DashboardComponent,
  },
  {
    path: "profile",
    canActivate: [AuthGuard],
    component: ProfileComponent,
  },
  {
    path: "home",
    component: HomeComponent,
    canActivate: [AuthGuard],
    data: { animation: "home" },
  },
  {
    path: "order-management",
    component: OrdermanagementComponent,
    canActivate: [AuthGuard],
    data: { animation: "order-management" },
  },
  {
    path: "quotation-listing/:id",
    component: CustomerlistingsComponent,
    canActivate: [AuthGuard],
    data: { animation: "customer-listing" },
  },
  {
    path: "earnings",
    component: EarningsComponent,
    canActivate: [AuthGuard],
    data: { animation: "earnings" },
  },
  {
    path: "verifications",
    component: VerificationsComponent,
    canActivate: [AuthGuard],
    data: { animation: "verifications" },
  },
  {
    path: "change-password",
    component: ChangePasswordComponent,
    canActivate: [AuthGuard],
    data: { animation: "change-password" },
  },
  {
    path: "refferals",
    component: RefferalsComponent,
    canActivate: [AuthGuard],
    data: { animation: "refferals" },
  },
  {
    path: "profile",
    component: ProfileComponent,
    canActivate: [AuthGuard],
    data: { animation: "profile" },
  },
  {
    path: "payment",
    component: PaymentComponent,
    canActivate: [AuthGuard],
    data: { animation: "payment" },
  },
  {
    path: "reviews",
    component: ReviewComponent,
    canActivate: [AuthGuard],
    data: { animation: "review" },
  },
  {
    path: "help",
    component: ContactComponent,
    canActivate: [AuthGuard],
    data: { animation: "help" },
  },
  {
    path: "subscription-plan",
    component: Checkout1Component,
    canActivate: [AuthGuard],
    data: { animation: "about-your-business" },
  },
  {
    path: "active-subscription",
    component: ActiveSubscription,
    canActivate: [AuthGuard],
    data: { animation: "about-your-business" },
  },
  {
    path: "subscription-renewel",
    component: SubscriptionRenewelComponent,
    canActivate: [AuthGuard],
    data: { animation: "about-your-business" },
  },
  {
    path: "chats",
    loadChildren: () => import("./chat/chat.module").then((m) => m.ChatModule),
  },
];
const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
  direction: "horizontal",
  observer: true,
};

@NgModule({
  declarations: [
    DashboardComponent,
    ProfileComponent,
    HomeComponent,
    OrdermanagementComponent,
    CustomerlistingsComponent,
    EarningsComponent,
    RefferalsComponent,
    SettingsComponent,
    Checkout1Component,
    ActiveSubscription,
    ContactComponent,
    ReviewComponent,
    PaymentComponent,
    SubscriptionRenewelComponent,
    ChangePasswordComponent,
  ],
  imports: [
    CommonModule,
    CoreCommonModule,
    ContentHeaderModule,
    NgbModule,
    NgSelectModule,
    FormsModule,
    RouterModule.forChild(routes),
    CardSnippetModule,
    NgApexchartsModule,
    NgxDatatableModule,
    SwiperModule,
    CoreTouchspinModule,
    CoreSidebarModule,
    NouisliderModule,
    FileUploadModule,
    Ng2FlatpickrModule,
    ChartsModule,
    ImageCropperModule,
    ClipboardModule,
    GoogleMapsModule,
  ],
  providers: [
    DashboardService,
    {
      provide: SWIPER_CONFIG,
      useValue: DEFAULT_SWIPER_CONFIG,
    },
  ],
})
export class SellerModule {}
