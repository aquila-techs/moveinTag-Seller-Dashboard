import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CoreMenuService } from '@core/components/core-menu/core-menu.service';
import { AuthenticationService } from '@core/services/authentication.service';


@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  /**
   *
   * @param {Router} _router
   * @param {AuthenticationService} _authenticationService
   */
  constructor(private _router: Router, 
    private _authenticationService: AuthenticationService,
    private _coreMenuService: CoreMenuService) {}

  // canActivate
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this._authenticationService.currentUserValue;
    if (currentUser) {
      // check if route is restricted by role
      if (route.data.roles && route.data.roles.indexOf(currentUser.role) === -1) {
        // role not authorised so redirect to not-authorized page
        this._router.navigate(['/pages/miscellaneous/not-authorized']);
        return false;
      }
      if(!currentUser.payment && route.routeConfig.path !== 'subscription-plan'){
        this._router.navigate(['/pages/seller/subscription-plan']);
        return false;
      }
      if(currentUser.subscriptionStatus === 'cancel' && route.routeConfig.path !== 'subscription-renewel'){
        this._router.navigate(['/pages/seller/subscription-renewel']);
        return false;
      }
      // authorised so return true
      return true;
    }
    window.localStorage.removeItem('currentUser');
    // not logged in so redirect to login page with the return url
    // console.log(state.url);
    // if(state.url.includes('/seller/')){
    //   this._router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    // }else{
    //   this._router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    // }
    this._router.navigate(['/login']);
    return false;
  }
}
