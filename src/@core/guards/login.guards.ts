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
        if(jwtdecode && jwtdecode?.isAdmin){
          this._router.navigate(['/pages/admin/dashboard'])
        }if(jwtdecode && !jwtdecode?.isAdmin){
          this._router.navigate(['/pages/seller/dashboard'])
        }
        return true;
    }
    return true;
  }
}
