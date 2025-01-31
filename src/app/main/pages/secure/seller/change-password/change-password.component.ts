import { Component, OnInit } from "@angular/core";
import { AuthenticationService } from "@core/services/authentication.service";
import { CoreConfigService } from "@core/services/config.service";
import { UserService } from "@core/services/services/user.service";
import { environment } from "environments/environment";
import {
  FormGroup,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";

import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-change-password",
  templateUrl: "./change-password.component.html",
  styleUrls: ["./change-password.component.scss"],
})
export class ChangePasswordComponent implements OnInit {
  public loginForm: UntypedFormGroup;
  public submitted = false;
  public contentHeader: object;
  public mergedPwdShow = false;
  public userProfile: any = {};
  public user;
  public baseUrl = environment.serverURL;
  public countriesData: any;
  public countriesList = [];
  public CountriesAddCustomArray = [];
  public countryStates = [];

  constructor(
    private _formBuilder: UntypedFormBuilder,
    private _coreConfigService: CoreConfigService,
    private _toastrService: ToastrService,
    private userService: UserService,
    private authenticationService: AuthenticationService
  ) {
    this._coreConfigService.config = {
      layout: {
        navbar: {
          hidden: false,
          showNavbarDashboard: true,
        },
        menu: {
          hidden: false,
        },
        footer: {
          hidden: true,
        },
      },
    };
  }

  imageUrl: any;

  /**
   * On init
   */
  ngOnInit(): void {
    this.authenticationService.currentUser.subscribe((x) => (this.user = x));
    this.contentHeader = {
      headerTitle: "Change Password",
      actionButton: false,
      breadcrumb: {
        type: "",
        links: [],
      },
    };

    this.loginForm = this._formBuilder.group(
      {
        oldPassword: ["", [Validators.required, Validators.minLength(6)]],
        newPassword: ["", [Validators.required, Validators.minLength(6)]],
        confirmNewPassword: [
          "",
          [Validators.required, Validators.minLength(6)],
        ],
      },
      {
        validator: this.mustMatch("newPassword", "confirmNewPassword"),
      }
    );
  }

  updateProfile() {}

  oldPassword = "";
  newPassword = "";

  showPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  mustMatch(password: string, confirmPassword: string) {
    return (formGroup: FormGroup) => {
      const passwordControl = formGroup.controls[password];
      const confirmPasswordControl = formGroup.controls[confirmPassword];

      if (
        confirmPasswordControl.errors &&
        !confirmPasswordControl.errors.mustMatch
      ) {
        return;
      }

      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ mustMatch: true });
      } else {
        confirmPasswordControl.setErrors(null);
      }
    };
  }

  onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    const data = {
      userId: this.user._id,
      oldPassword: this.loginForm.value.oldPassword,
      newPassword: this.loginForm.value.newPassword,
    };

    this.userService.updatePassword(data).subscribe({
      next: (res) => {
        this._toastrService.success(
          "Your Password has been updated!",
          "Updated!"
        );
        this.loginForm.reset();
        this.submitted = false;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  get loginFr() {
    return this.loginForm.controls;
  }
  get f() {
    return this.loginForm.controls;
  }
}
