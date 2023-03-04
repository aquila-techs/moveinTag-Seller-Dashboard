import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '@core/services/authentication.service';
import jwt_decode from 'jwt-decode';


@Injectable({ providedIn: 'root' })
export class LoginGuard implements CanActivate {
  /**
   *
   * @param {Router} _router
   * @param {AuthenticationService} _authenticationService
   */
  constructor(private _router: Router, 
    private _authenticationService: AuthenticationService) {}

  // canActivate
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this._authenticationService.currentUserValue;
    if (currentUser) {
        let jwtdecode: any = jwt_decode(currentUser.accessToken);
        console.log(jwtdecode);
        if(jwtdecode && jwtdecode?.role === 'Seller' && window.localStorage.getItem('currentUser')){
          this._router.navigate(['/pages/seller/home'])
        }
        return true;
    }
    return true;
  }
}
