import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import 'hammerjs';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr'; // For auth after login toast

import { CoreModule } from '@core/core.module';
import { CoreCommonModule } from '@core/common.module';
import { CoreSidebarModule, CoreThemeCustomizerModule } from '@core/components';

import { coreConfig } from 'app/app-config';

import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';
import { SampleModule } from 'app/main/sample/sample.module';
import { ErrorComponent } from './main/pages/public/error/error.component';
import { LoginComponent } from './main/pages/public/login/login.component';
import { HeaderInterceptor } from '@core/interceptors/header.interceptor';
import { HttpErrorInterceptor } from '@core/interceptors/http-error.interceptor';
import { SecureModule } from './main/pages/secure/secure.module';
import { AdminLoginComponent } from './main/pages/public/admin-login/admin-login.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SignupComponent } from './main/pages/public/signup/signup.component';
import { ForgotPasswordComponent } from './main/pages/public/forgot-password/forgot-password.component';
import { LoginGuard } from '@core/guards/login.guards';
import { AuthResetPasswordComponent } from './main/pages/public/reset-password/reset-password.component';
import { VerifyEmailComponent } from './main/pages/public/verify-email/verify-email.component';


const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    canActivate: [LoginGuard],
    component: AdminLoginComponent,
    data: { animation: 'auth' }

  },
  {
    path: 'signup',
    canActivate: [LoginGuard],
    component: SignupComponent,
    data: { animation: 'auth' }

  },
  {
    path: 'forgot-password',
    canActivate: [LoginGuard],
    component: ForgotPasswordComponent,
    data: { animation: 'auth' }

  },
  {
    path: 'reset-password/:token',
    canActivate: [LoginGuard],
    component: AuthResetPasswordComponent,
    data: { animation: 'auth' }

  },
  {
    path: 'verify-email/:id',
    canActivate: [LoginGuard],
    component: VerifyEmailComponent,
    data: { animation: 'auth' }

  },
  {
    path: 'seller/login',
    canActivate: [LoginGuard],
    component: LoginComponent,
    data: { animation: 'auth' }

  },
  {
    path: '**',
    component: ErrorComponent,
    data: { animation: 'misc' }
  },
  {
    path: 'pages',
    loadChildren: () => import('./main/pages/secure/secure.module').then(m => m.SecureModule)
  },
];

@NgModule({
  declarations: [AppComponent, ErrorComponent, LoginComponent, AdminLoginComponent, SignupComponent, 
    ForgotPasswordComponent, AuthResetPasswordComponent, VerifyEmailComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes, {
      scrollPositionRestoration: 'enabled', // Add options right here
      relativeLinkResolution: 'legacy',
      useHash: true
    }),
    TranslateModule.forRoot(),

    //NgBootstrap
    NgbModule,
    ToastrModule.forRoot(),

    // Core modules
    CoreModule.forRoot(coreConfig),
    CoreCommonModule,
    CoreSidebarModule,
    CoreThemeCustomizerModule,

    // App modules
    LayoutModule,
    SampleModule,
    SecureModule,
    NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' })
  ],
  providers:[{
    provide: HTTP_INTERCEPTORS,
    useClass: HeaderInterceptor,
    multi: true
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpErrorInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule {}
