import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from '@core/guards/auth.guards';
import { NgApexchartsModule } from 'ng-apexcharts';
import { DashboardService } from '@core/services/services/dashboard.service';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CardSnippetModule } from '@core/components/card-snippet/card-snippet.module';
import { NouisliderModule } from 'ng2-nouislider';
import { CoreSidebarModule } from '@core/components';
import { CoreTouchspinModule } from '@core/components/core-touchspin/core-touchspin.module';
import { SwiperConfigInterface, SwiperModule, SWIPER_CONFIG } from 'ngx-swiper-wrapper';
import { FileUploadModule } from 'ng2-file-upload';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';
import { ChartsModule } from 'ng2-charts';
import { ProfileComponent } from './profile/profile.component';
import { ImageCropperModule } from 'ngx-image-cropper';

const routes: Routes = [
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    component: DashboardComponent
  },
  {
    path: 'profile',
    canActivate: [AuthGuard],
    component: ProfileComponent
  }
]
const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
  direction: 'horizontal',
  observer: true
};

@NgModule({
  declarations: [
    DashboardComponent,
    ProfileComponent
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
    ImageCropperModule
  ],
  providers: [
    DashboardService,
    {
      provide: SWIPER_CONFIG,
      useValue: DEFAULT_SWIPER_CONFIG
    }
  ]
})
export class SellerModule {}
