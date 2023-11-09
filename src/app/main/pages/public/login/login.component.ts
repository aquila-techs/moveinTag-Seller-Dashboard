import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CoreConfigService } from '@core/services/config.service';
import { AuthenticationService } from '@core/services/authentication.service';
import { Role } from '@core/models';
import { menu } from 'app/menu/menu';
import { CoreMenuService } from '@core/components/core-menu/core-menu.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {
  public coreConfig: any;
  public loginForm: UntypedFormGroup;
  public loading = false;
  public submitted = false;
  public returnUrl: string;
  public error = '';
  public passwordTextType: boolean;
  menu: any;

  private _unsubscribeAll: Subject<any>;

  constructor(
    private _coreConfigService: CoreConfigService,
    private _formBuilder: UntypedFormBuilder,
    private _route: ActivatedRoute,
    private _router: Router,
    private _authenticationService: AuthenticationService,
    private _coreMenuService: CoreMenuService,
    private _toastrService: ToastrService
  ) {
    this._unsubscribeAll = new Subject();
    this.menu = menu;
    // Configure the layout
    this._coreConfigService.config = {
      layout: {
        navbar: {
          hidden: true
        },
        menu: {
          hidden: true
        },
        footer: {
          hidden: true
        },
        customizer: false,
        enableLocalStorage: false
      }
    };

  }



  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  /**
   * Toggle password
   */
  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    // this._router.navigate(['/pages/seller/home']);
    // Login
    this.loading = true;
    this._authenticationService.loginAdmin(this.loginForm.value).subscribe({
      next: (res) => {
        this.loading = false;
        // if(res?.user && res.user?.role && res.user.role.title === Role.Admin ){
        // Register the menu to the menu service
        this._coreMenuService.register('main', this.menu);
        // Set the main menu as our current menu
        // this._toastrService.success('','Login Successfully');
        this._coreMenuService.setCurrentMenu('main');
        this._router.navigate(['/pages/seller/home']);
        // }
      },
      error: (err) => {
        this.loading = false;
        // this._toastrService.error('','Email or password is wrong!');
        console.log(err);
      },
    })
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.loginForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/';

    // Subscribe to config changes
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      this.coreConfig = config;
    });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
