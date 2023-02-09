import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CoreMenuService } from '@core/components/core-menu/core-menu.service';
import { AuthenticationService } from '@core/services/authentication.service';
import { adminMenu, sellerMenu } from 'app/menu/menu';


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
      if(this._authenticationService.isAdmin && !state.url.includes('/seller/')){
        this._router.navigate([state.url.replace('seller','admin')]);
      }else if(!this._authenticationService.isAdmin && !state.url.includes('/seller/')){
        this._router.navigate([state.url.replace('admin','seller')]);
      }

      if(this._authenticationService.isAdmin && !this._coreMenuService.getMenu(adminMenu)){
        // Register the menu to the menu service
        this._coreMenuService.unregister('main');
        this._coreMenuService.register('main', adminMenu);
        // Set the main menu as our current menu
        this._coreMenuService.setCurrentMenu('main');
      }else if(!this._coreMenuService.getMenu(sellerMenu)){
        this._coreMenuService.unregister('main');
        // Register the menu to the menu service
        this._coreMenuService.register('main', sellerMenu);
        // Set the main menu as our current menu
        this._coreMenuService.setCurrentMenu('main');
      }
      // check if route is restricted by role
      if (route.data.roles && route.data.roles.indexOf(currentUser.role) === -1) {
        // role not authorised so redirect to not-authorized page
        this._router.navigate(['/pages/miscellaneous/not-authorized']);
        return false;
      }

      // authorised so return true
      return true;
    }
    window.localStorage.removeItem('currentUser');
    // not logged in so redirect to login page with the return url
    console.log(state.url);
    if(state.url.includes('/admin/')){
      this._router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    }else{
      this._router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    }
    // this._router.navigate(['/login']);
    return false;
  }
}
