import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Role, User } from '@core/models';
import { HttpService } from './http.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  //public
  public currentUser: Observable<User>;

  //private
  private currentUserSubject: BehaviorSubject<User>;

  /**
   *
   * @param {HttpClient} _http
   * @param {ToastrService} _toastrService
   */
  constructor(private _http: HttpService, private _toastrService: ToastrService) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(window.localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  // getter: currentUserValue
  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  /**
   *  Confirms if user is admin
   */
  get isAdmin() {
    console.log(this.currentUserSubject);
    return (this.currentUser && this.currentUserSubject.value?.role?.title === Role.Admin) || false;
  }

  /**
   *  Confirms if user is client
   */
  // get isClient() {
  //   return this.currentUser && this.currentUserSubject.value.role.title === Role.Client;
  // }
  // get isSeller() {
    // return this.currentUser && this.currentUserSubject.value.userType.title === Role.Seller;
  // }

 /**
   * Admin login
   *
   * @param email
   * @param password
   * @returns user
   */
  loginAdmin(data) {
    return this._http.post('user/seller-login', data)
      .pipe(
        map(res => {
          // login successful if there's a jwt token in the response
          if (res && res.accessToken) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            res.user.accessToken = res.accessToken;
            localStorage.setItem('currentUser', JSON.stringify(res.user));

            // Display welcome toast!
            setTimeout(() => {
              this._toastrService.success(
                'You have successfully logged in',
                '',{ toastClass: 'toast ngx-toastr', closeButton: true });
            }, 300);

            // notify
            this.currentUserSubject.next(res.user);
          }

          return res;
        })
      );
  }

  /**
   * Seller login
   *
   * @param email
   * @param password
   * @returns user
   */
  login(data) {
    return this._http.post('user/seller-login', data)
    .pipe(
      map(res => {
        // login successful if there's a jwt token in the response
        if (res && res.accessToken) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          res.user.accessToken = res.accessToken;
          localStorage.setItem('currentUser', JSON.stringify(res.user));

          // Display welcome toast!
          setTimeout(() => {
            this._toastrService.success(
              'You have successfully logged in',
              '',{ toastClass: 'toast ngx-toastr', closeButton: true });
          }, 300);

          // notify
          this.currentUserSubject.next(res.user);
        }

        return res;
      })
    );
}

  /**
   * User logout
   *
   */
  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    // notify
    this.currentUserSubject.next(null);
  }
}
