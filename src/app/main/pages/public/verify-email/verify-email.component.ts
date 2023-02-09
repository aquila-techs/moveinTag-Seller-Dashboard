import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { CoreConfigService } from '@core/services/config.service';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from '@core/services/admin-services/admin.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VerifyEmailComponent implements OnInit {
  // Public
  public coreConfig: any;
  public passwordTextType: boolean;
  public confPasswordTextType: boolean;
  public resetPasswordForm: UntypedFormGroup;
  public submitted = false;

  // Private
  private _unsubscribeAll: Subject<any>;
  private id = null;
  public success = false;
  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   * @param {FormBuilder} _formBuilder
   */
  constructor(private _coreConfigService: CoreConfigService, private _formBuilder: UntypedFormBuilder,
    private adminService: AdminService, private toatrService: ToastrService,private _router: Router, private route: ActivatedRoute) {
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


  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.resetPasswordForm = this._formBuilder.group({
      newPassword: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    });
    this.route.params.subscribe((params: Params) => {
      if(!params['id']){
        this._router.navigate(['/login']);
      }
      this.id = params['id'];
      this.adminService.verifyEmail(this.id).pipe(takeUntil(this._unsubscribeAll)).subscribe({
        next: (res)=>{
          if(res && res.message){
            this.toatrService.error('Please check your email again.', 'Something Wrong!')
            return;
          }
          this.success = true;
          this.toatrService.success('You have successfully verify your email.','Sucessfully Reset!');
        }
      })
    });
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
