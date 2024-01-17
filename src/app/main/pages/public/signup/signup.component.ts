import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { CoreConfigService } from '@core/services/config.service';
import { AdminService } from '@core/services/services/admin.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SignupComponent implements OnInit {
  // Public
  public coreConfig: any;
  public passwordTextType: boolean;
  public registerForm: UntypedFormGroup;
  public submitted = false;
  public error = '';
  public loading = false;
  public affcode: string;

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   * @param {FormBuilder} _formBuilder
   */
  constructor(private _coreConfigService: CoreConfigService,
    private _formBuilder: UntypedFormBuilder,
    private _adminService: AdminService,
    private _toastrService: ToastrService,
    private activeRoute: ActivatedRoute,
    private _rotuer: Router) {
    this._unsubscribeAll = new Subject();

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
    return this.registerForm.controls;
  }

  /**
   * Toggle password
   */
  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  /**
   * On Submit
   */
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }
    if (!this.registerForm.value.agreeToTerms) {
      this._toastrService.error('Please accept Terms & Conditions', 'Terms & Conditions');
      return;
    }

    if (this.affcode) {

      const OBJ = {
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        companyName: this.registerForm.value.companyName,
        referrerCode: this.affcode
      }

      this._adminService.createSeller(OBJ).subscribe({
        next: (res) => {
          console.log(res)
          window.sessionStorage.setItem('currentUser', JSON.stringify(res.user));
          // this._toastrService.success('','Seller register please wait for admin approval');
          this._rotuer.navigate(['/subscription-detail'])
        },
        error: (err) => {

        },
      })

    } else {

      const OBJ = {
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        companyName: this.registerForm.value.companyName
      }

      this._adminService.createSeller(OBJ).subscribe({
        next: (res) => {
          console.log(res)
          window.sessionStorage.setItem('currentUser', JSON.stringify(res.user));
          // this._toastrService.success('','Seller register please wait for admin approval');
          this._rotuer.navigate(['/subscription-detail'])
        },
        error: (err) => {

        },
      })

    }

  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {

    this.activeRoute.queryParams.subscribe(params => {
      this.affcode = params['affcode'];
    });

    if (this.affcode) {
      this.registerForm = this._formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        companyName: ['', Validators.required],
        referralCode: [this.affcode, Validators.required],
        agreeToTerms: ['', Validators.required]
      });
    } else {
      this.registerForm = this._formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        companyName: ['', Validators.required],
        agreeToTerms: ['', Validators.required]
      });
    }

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
