import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { AuthenticationService } from '@core/services/authentication.service';


@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  /**
   * @param {Router} _router
   */
  constructor(private _router: Router,
    private _toastrService: ToastrService,
    private spinner: NgxSpinnerService,
    private _authenticationService: AuthenticationService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
   
    return next.handle(request).pipe(
    
      catchError(err => {
        this.spinner.hide('main');
        if ([401, 403].indexOf(err.status) !== -1) {
          // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
          this._authenticationService.logout();
          this._router.navigate(['/login']);
          // ? Can also logout and reload if needed
          // location.reload(true);
        }
        // throwError
        const error = err.error.message || err.statusText;
        this._toastrService.error(error,'',
              { closeButton: true }
        );
        return throwError(error);
      })
    ).pipe(map<HttpEvent<any>, any>((evt: HttpEvent<any>) => {
      if (evt instanceof HttpResponse) {
        this.spinner.hide('main');
      }
      return evt;
    }));;
  }
}
