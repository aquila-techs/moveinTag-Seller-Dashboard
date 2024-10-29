import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '@core/services/authentication.service';
import { environment } from 'environments/environment';
import { NgxSpinnerService } from "ngx-spinner";

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService,
    private spinner: NgxSpinnerService) { }


  /**
   * Add auth header with jwt if user is logged in and request is to api url
   * @param request
   * @param next
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!request.url.includes('/chat/sendMessage') && !request.url.includes('currency/update-user-pref-currency')) {
      this.spinner.show('main');
    }
    if (request.url.includes('/seller-category/get-nearby-zipcode')) {
      this.spinner.hide("main");
    }
    if (request.url.includes('/user/save-seller-zipcodes')) {
      this.spinner.hide("main");
    }

    const currentUser = this.authenticationService.currentUserValue || window.localStorage.getItem('currentUser') && JSON.parse(window.localStorage.getItem('currentUser'));
    const isLoggedIn = currentUser && currentUser.accessToken;
    const isApiUrl = request.url.startsWith(environment.apiUrl);
    if (isLoggedIn && isApiUrl) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser.accessToken}`
        }
      });
    }

    return next.handle(request);
  }
}
