import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SellerModule } from './seller/seller.module';

const routes: Routes = [
  {
    path: 'pages/seller',
    loadChildren: () => import('./seller/seller.module').then(m => m.SellerModule)
  }
]


@NgModule({
  declarations: [
  ],
  imports: [
    SellerModule,
    RouterModule.forChild(routes),
  ],

  providers: []
})
export class SecureModule {}
