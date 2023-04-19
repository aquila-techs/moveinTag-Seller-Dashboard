import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '@core/services/authentication.service';
import jwt_decode from 'jwt-decode';


@Injectable({ providedIn: 'root' })
export class PaymentGuard implements CanActivate {
  /**
   *
   * @param {Router} _router
   * @param {AuthenticationService} _authenticationService
   */
  constructor(private _router: Router, 
    private _authenticationService: AuthenticationService) {}

  // canActivate
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = window.sessionStorage.getItem('currentUser');
    if (!currentUser) {
        this._router.navigate(['/login'])
        return true;
    }
    return true;
  }
}
