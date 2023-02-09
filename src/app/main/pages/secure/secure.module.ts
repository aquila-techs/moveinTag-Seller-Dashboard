import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminModule } from './admin/admin.module';
import { SellerModule } from './seller/seller.module';

const routes: Routes = [
  {
    path: 'pages/seller',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  }
]


@NgModule({
  declarations: [
  ],
  imports: [
    AdminModule,
    SellerModule,
    RouterModule.forChild(routes),
  ],

  providers: []
})
export class SecureModule {}
