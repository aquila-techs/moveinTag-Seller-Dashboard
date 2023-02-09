import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '@core/services/authentication.service';
import { environment } from 'environments/environment';
import { NgxSpinnerService } from "ngx-spinner";

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService,
      private spinner: NgxSpinnerService) {}

  
  /**
   * Add auth header with jwt if user is logged in and request is to api url
   * @param request
   * @param next
   */
   intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.spinner.show('main');
    const currentUser = this.authenticationService.currentUserValue;
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
