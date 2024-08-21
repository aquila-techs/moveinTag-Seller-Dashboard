import { Component, OnInit, AfterContentChecked } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CoreConfigService } from "@core/services/config.service";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { UserService } from "@core/services/services/user.service";
import { AuthenticationService } from "@core/services/authentication.service";
import { HttpClient } from "@angular/common/http";
import {
  FormControl,
  Validators,
  UntypedFormGroup,
  UntypedFormBuilder,
} from "@angular/forms";
import { StripeService } from "./stripe.service";

@Component({
  selector: "app-checkout1",
  templateUrl: "./checkout1.component.html",
  styleUrls: ["./checkout1.component.scss"],
})
export class Checkout1Component implements OnInit, AfterContentChecked {
  // public
  agreeToTerms = new FormControl(false, Validators.requiredTrue);
  public contentHeader: object;
  public navbar: object;
  public sellerProfile: any;
  country: number;
  lastName = "";
  firstName = "";
  countryName = "";
  phoneCode = "+1";
  isLoading = "false";
  phone = "";
  cvc = "";
  cardNumber = "";
  cardname = "";
  public isAfterSingup = false;
  countryId = [
    { id: 1, name: "United States" },
    { id: 2, name: "Canada" },
    { id: 3, name: "India" },
    { id: 4, name: "Pakistan" },
  ];
  user = null;
  public countriesData: any;
  public CouponForm: UntypedFormGroup;
  public loading = false;
  public submitted = false;
  public countriesList = [];
  public getSellerProfile = true;
  public subscriptionPacakge = false;
  public cardDetail = false;
  public applyCoupon = false;
  public invalidCoupon = false;
  public postalCode = "";
  // private stripe: any;

  // public
  selectedMonth: number;
  selectedYear: number;
  radioModel = 1;
  months = [
    { id: 1, name: "1" },
    { id: 2, name: "2" },
    { id: 3, name: "3" },
    { id: 4, name: "4" },
    { id: 5, name: "5" },
    { id: 6, name: "6" },
    { id: 7, name: "7" },
    { id: 8, name: "8" },
    { id: 9, name: "9" },
    { id: 10, name: "10" },
    { id: 11, name: "11" },
    { id: 12, name: "12" },
  ];
  years = [
    { id: 2023, name: "2023" },
    { id: 2024, name: "2024" },
    { id: 2025, name: "2025" },
    { id: 2026, name: "2026" },
    { id: 2027, name: "2027" },
    { id: 2028, name: "2028" },
    { id: 2029, name: "2029" },
    { id: 2030, name: "2030" },
    { id: 2031, name: "2031" },
    { id: 2032, name: "2032" },
    { id: 2033, name: "2033" },
    { id: 2034, name: "2034" },
  ];

  countryCode = [
    {
      name: "Canada",
      dial_code: "+1",
      code: "CA",
    },
  ];
  checkboxModel = {
    left: true,
    middle: false,
    right: false,
  };

  licensePhotoChangedEvent: any = "";
  licensePhotoChangedEventTYPE: any = "";
  libilityInsurancePhotoChangedEvent: any = "";
  libilityInsurancePhotoChangedEventTYPE: any = "";
  IdentityCardPhotoChangedEvent: any = "";
  IdentityCardPhotoChangedEventTYPE: any = "";

  constructor(
    private stripeService: StripeService,
    private _coreConfigService: CoreConfigService,
    private http: HttpClient,
    private _authenticationService: AuthenticationService,
    private _router: Router,
    private toastrService: ToastrService,
    private userService: UserService,
    private _formBuilder: UntypedFormBuilder
  ) {
    // this.stripe = Stripe('pk_test_krO93K0IJTYIZQI4Kji8oDtK'); // Replace with your Stripe public key
    this.user =
      (window.localStorage.getItem("currentUser") &&
        JSON.parse(window.localStorage.getItem("currentUser"))) ||
      (window.sessionStorage.getItem("currentUser") &&
        JSON.parse(window.sessionStorage.getItem("currentUser")));
    if (window.sessionStorage.getItem("currentUser")) {
      window.sessionStorage.removeItem("currentUser");
      this.isAfterSingup = true;
    }
    // Configure the layout
    this._coreConfigService.config = {
      layout: {
        navbar: {
          hidden: true,
        },
        footer: {
          hidden: true,
        },
        menu: {
          hidden: true,
        },
        customizer: false,
        enableLocalStorage: false,
      },
    };
  }

  licensefileChangeEvent(event: any): void {
    if (
      event.target.files[0].type === "application/pdf" ||
      event.target.files[0].type === "image/jpeg" ||
      event.target.files[0].type === "image/png"
    ) {
      this.licensePhotoChangedEvent = event.target.files[0];
      this.licensePhotoChangedEventTYPE = event.target.files[0].type;
      return;
    } else {
      this.toastrService.error(
        "Please select correct format of file (PDF, PNG, JPG)"
      );
    }
  }

  libilityInsurancefileChangeEvent(event: any): void {
    if (
      event.target.files[0].type === "application/pdf" ||
      event.target.files[0].type === "image/jpeg" ||
      event.target.files[0].type === "image/png"
    ) {
      this.libilityInsurancePhotoChangedEvent = event.target.files[0];
      this.libilityInsurancePhotoChangedEventTYPE = event.target.files[0].type;
      return;
    } else {
      this.toastrService.error(
        "Please select correct format of file (PDF, PNG, JPG)"
      );
    }
  }

  IdentityCardfileChangeEvent(event: any): void {
    if (
      event.target.files[0].type === "application/pdf" ||
      event.target.files[0].type === "image/jpeg" ||
      event.target.files[0].type === "image/png"
    ) {
      this.IdentityCardPhotoChangedEvent = event.target.files[0];
      this.IdentityCardPhotoChangedEventTYPE = event.target.files[0].type;

      return;
    } else {
      this.toastrService.error(
        "Please select correct format of file (PDF, PNG, JPG)"
      );
    }
  }
  /**
   * On init
   */

  async ngOnInit() {
    this.CouponForm = this._formBuilder.group({
      couponCode: [""],
    });

    this.contentHeader = {
      headerTitle: "Dashboard",
      actionButton: false,
      headerRight: false,
    };
    this.navbar = {
      hidden: false,
    };
    this.isLoading = "true";
    this.userService.getProfile(this.user._id).subscribe({
      next: (res: any) => {
        if (res.phoneCode && res.phone && res.country) {
          this.licensePhotoChangedEvent = null;
          this.libilityInsurancePhotoChangedEvent = null;
          this.IdentityCardPhotoChangedEvent = null;
          this.getSellerProfile = false;
          this.subscriptionPacakge = false;
          this.cardDetail = true;
          this.isLoading = "false";
        } else {
          this.isLoading = "false";
        }
      },
    });

    this.getCountries();
    this.generateToken();
  }

  async generateToken() {
    const stripe = await this.stripeService.createStripe();
    const cardElement = await this.stripeService.createCardElement();
    cardElement.mount("#card-element");

    const submitButton = document.getElementById("submit");
    if (submitButton) {
      submitButton.addEventListener("click", async () => {
        if (!this.agreeToTerms.valid) {
          this.toastrService.error(
            "Please accept Terms & Conditions",
            "Terms & Conditions"
          );
          return;
        }

        const tokenResult = (await this.stripeService.createToken(
          cardElement
        )) as { token: { id: string; card: { id: string } } } | string;

        if (typeof tokenResult === "string") {
          console.log("Error generating token");
        } else {
          let subscriptionData = {
            _id: this.user._id,
            email: this.user.email,
            name: this.user.companyName,
            token: tokenResult.token.id,
            firstName: this.firstName,
            lastName: this.lastName,
            country: this.country,
            postalCode: this.postalCode,
            phone: this.phone,
            priceId: this.priceId,
            free_trial: this.free_trial,
            coupon: this.applyCoupon === true ? "GdnsqZfH" : "",
          };
          this.userService
            .createSubscriptionCustomer(subscriptionData)
            .subscribe({
              next: (res) => {
                if (res.status === "incomplete") {
                  let body = {
                    _id: this.user._id,
                  };
                  this.userService.sendEmailOnCardDecline(body).subscribe({
                    next: (value) => {
                      this.toastrService.error(
                        "You card is declined. We have sent you an email for this issue. Please check!"
                      );
                    },
                  });
                } else {
                  let data = {
                    _id: this.user._id,
                    paymentMethodId: tokenResult.token.card.id,
                  };
                  this.userService.setPaymentMethodAsDefault(data).subscribe({
                    next: (value) => {},
                  });

                  if (this.isAfterSingup) {
                    const OBJ = {
                      userId: this.user._id,
                      purchaseAmount: this.total,
                    };

                    this.userService.affMakePurchase(OBJ).subscribe({
                      next: (value) => {},
                    });

                    this.toastrService.success(
                      "You have successfully subscribed."
                    );
                    this._router.navigate(["/pages/seller/home"]);
                    // this._router.navigate(['/login']);
                  } else {
                    const OBJ = {
                      userId: this.user._id,
                      purchaseAmount: this.total,
                    };

                    this.userService.affMakePurchase(OBJ).subscribe({
                      next: (value) => {},
                    });

                    this.user["payment"] = true;
                    this._authenticationService.updateUserData(this.user);
                    this._router.navigate(["/pages/seller/home"]);
                  }
                }
              },
              error: (err) => {
                let body = {
                  _id: this.user._id,
                };
                this.userService.sendEmailOnCardDecline(body).subscribe({
                  next: (value) => {},
                });
              },
            });
        }
      });
    } else {
      console.error("Submit button not found.");
    }
  }

  getCountries() {
    this.http
      .get(
        "https://pkgstore.datahub.io/core/world-cities/world-cities_json/data/5b3dd46ad10990bca47b04b4739a02ba/world-cities_json.json"
      )
      .subscribe({
        next: (res: any) => {
          this.countriesData = res;

          const filteredData = this.countriesData.filter(
            (item) =>
              item.country === "Canada" || item.country === "United States"
          );

          const country = [
            ...new Set(filteredData.map((item) => item.country)),
          ];
          this.countriesList = country;
        },
      });
  }

  transformToUppercase(event: Event): void {
    const input = event.target as HTMLInputElement;
    const uppercasedValue = input.value.toUpperCase();
    input.value = uppercasedValue;

    // Update the form control value to reflect the uppercase transformation
    this.CouponForm.get("couponCode")?.setValue(uppercasedValue, {
      emitEvent: false,
    });
  }
  onSubmit() {
    this.submitted = true;

    this.invalidCoupon = false;

    if (this.CouponForm.invalid) {
      return;
    }

    const Form = this.CouponForm.value;
    if (Form.couponCode && Form.couponCode !== "FREE2024") {
      this.invalidCoupon = true;
    } else {
      this.invalidCoupon = false;
      this.applyCoupon = true;

      if (Form.couponCode !== "") {
        this.discount = "398.00";
        this.total = "0.00";
      }
    }
  }

  onCountryChange(country: any) {
    this.countryName = country;
  }

  onCountryPhoneCode(code: any) {
    this.phoneCode = "+1";
  }

  async ngAfterViewInit(): Promise<void> {
    this.sellerProfile = this.sellerProfile;
  }

  async ngAfterContentChecked(): Promise<void> {
    if (this.cardDetail && !this.cardElementMounted) {
      this.mountCardElement();
      this.cardElementMounted = true;
    }

    this.sellerProfile = this.sellerProfile;
  }

  private cardElementMounted = false;

  private async mountCardElement() {
    if (!this.cardElementMounted) {
      const stripe = await this.stripeService.createStripe();
      const cardElement = await this.stripeService.createCardElement();
      cardElement.mount("#card-element");
      this.cardElementMounted = true;
      this.generateToken();
    }
  }

  logout() {
    this._authenticationService.logout();
    this._router.navigate(["/login"]);
  }

  public userProfile: any = {};

  updateUserProfile() {
    let data = this.userProfile;
    data["id"] = this.user;
    this.userService.updateProfile(data).subscribe({
      next: (res) => {
        this.userProfile = JSON.parse(JSON.stringify(res));
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  goToNextStep() {
    console.log(this.phoneCode);
    if (this.phoneCode && this.phone && this.countryName) {
      let data = this.userProfile;
      data["id"] = this.user;

      const OBJ = {
        id: this.user._id,
        phoneCode: this.phoneCode,
        phone: this.phone,
        country: this.countryName,
      };

      this.userService.updateProfile(OBJ).subscribe({
        next: (res) => {
          this.userProfile = JSON.parse(JSON.stringify(res));

          this.licensePhotoChangedEvent = null;
          this.libilityInsurancePhotoChangedEvent = null;
          this.IdentityCardPhotoChangedEvent = null;
          this.getSellerProfile = false;
          this.subscriptionPacakge = false;
          this.cardDetail = true;
        },
        error: (err) => {
          console.log(err);
        },
      });
    } else {
      this.toastrService.error("Please enter all fields.", "");
    }
  }

  goToFinalStep() {
    this.subscriptionPacakge = false;
    this.cardDetail = true;
  }

  payment() {
    if (!this.agreeToTerms.valid) {
      this.toastrService.error(
        "Please accept Terms & Conditions",
        "Terms & Conditions"
      );
      return;
    }
    return;
    if (
      this.cvc &&
      this.cardNumber &&
      this.cardname &&
      this.selectedMonth &&
      this.selectedMonth
    ) {
      let data = {
        cvc: this.cvc,
        number: this.cardNumber,
        exp_month: this.selectedMonth,
        exp_year: this.selectedYear,
      };

      this.userService.createStripeToken(data).subscribe({
        next: (value) => {
          let subscriptionData = {
            _id: this.user._id,
            email: this.user.email,
            name: this.user.companyName,
            token: value.id,
            firstName: this.firstName,
            lastName: this.lastName,
            country: this.country,
            postalCode: this.postalCode,
            phone: this.phone,
            priceId: this.priceId,
            free_trial: this.free_trial,
          };
          this.userService
            .createSubscriptionCustomer(subscriptionData)
            .subscribe({
              next: (res) => {
                console.log(res);
                let data = {
                  _id: this.user._id,
                  paymentMethodId: value.card.id,
                };
                this.userService.setPaymentMethodAsDefault(data).subscribe({
                  next: (value) => {},
                });

                if (this.isAfterSingup) {
                  const OBJ = {
                    userId: this.user._id,
                    purchaseAmount: this.total,
                  };

                  this.userService.affMakePurchase(OBJ).subscribe({
                    next: (value) => {},
                  });

                  this.toastrService.success(
                    "You have successfully subscribed."
                  );
                  this._router.navigate(["/pages/seller/home"]);
                  // this._router.navigate(['/login']);
                } else {
                  const OBJ = {
                    userId: this.user._id,
                    purchaseAmount: this.total,
                  };

                  this.userService.affMakePurchase(OBJ).subscribe({
                    next: (value) => {},
                  });

                  this.user["payment"] = true;
                  this._authenticationService.updateUserData(this.user);
                  this._router.navigate(["/pages/seller/home"]);
                }
              },
            });
        },
      });
    }
  }

  priceId = "price_1P3AMSL7MEQHcjwNsnSSUyQo";
  signupCost = "price_1P3APGL7MEQHcjwNZ94I8WJy";
  charges = "398.00";
  discount = "199.00";
  total = "199.00";
  free_trial = "0";
  selectPackage() {
    this.priceId = "price_1P3AMSL7MEQHcjwNsnSSUyQo";
    this.signupCost = "price_1P3APGL7MEQHcjwNZ94I8WJy";
    this.charges = "398.00";
    this.discount = "199.00";
    this.total = "199.00";
    this.free_trial = "0";
    // if (this.radioModel === 1) {
    //   this.priceId = "price_1NhaU9DmnN3Lb8U78yKEA2id";
    //   this.charges = "9.99";
    //   this.discount = "0.00";
    //   this.total = "9.99";
    //   this.free_trial = "1";
    // } else if (this.radioModel === 2) {
    //   this.priceId = "price_1NhaUqDmnN3Lb8U7IsN8Lc5u";
    //   this.charges = "8.25";
    //   this.discount = "20.88";
    //   this.total = "99.00";
    //   this.free_trial = "7";
    // } else {
    //   this.priceId = "price_1NhaUqDmnN3Lb8U7IsN8Lc5u";
    //   this.charges = "200.00";
    //   this.discount = "00.00";
    //   this.total = "200.00";
    //   this.free_trial = "7";
    // }
  }
}
