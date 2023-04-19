import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation, AfterViewInit, AfterContentChecked } from '@angular/core'
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import { CoreConfigService } from '@core/services/config.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '@core/services/services/user.service';
import { AuthenticationService } from '@core/services/authentication.service';
// declare var Stripe: any;

@Component({
  selector: 'app-checkout1',
  templateUrl: './checkout1.component.html',
  styleUrls: ['./checkout1.component.scss'],
})
export class Checkout1Component implements OnInit, AfterContentChecked {
  // public
  public contentHeader: object;
  public navbar: object;
  public sellerProfile: any;
  country: number;
  lastName="";
  firstName="";
  phone="";
  cvc="";
  cardNumber="";
  cardname="";
  public isAfterSingup = false;
  countryId = [
    { id: 1, name: 'United States' },
    { id: 2, name: 'Canada' },
    { id: 3, name: 'India' },
    { id: 4, name: 'Pakistan' },
  ];
  user = null;
  public getSellerProfile = false;
  public subscriptionPacakge = false;
  public cardDetail = true;
  public postalCode = "";
  // private stripe: any;

  // public
  selectedMonth: number;
  selectedYear: number;
  radioModel = 1;
  months = [
    { id: 1, name: '1' },
    { id: 2, name: '2' },
    { id: 3, name: '3' },
    { id: 4, name: '4' },
    { id: 5, name: '5' },
    { id: 6, name: '6' },
    { id: 7, name: '7' },
    { id: 8, name: '8' },
    { id: 9, name: '9' },
    { id: 10, name: '10' },
    { id: 11, name: '11' },
    { id: 12, name: '12' },
  ];
  years = [
    { id: 2023, name: '2023' },
    { id: 2024, name: '2024' },
    { id: 2025, name: '2025' },
    { id: 2026, name: '2026' },
    { id: 2027, name: '2027' },
    { id: 2028, name: '2028' },
    { id: 2029, name: '2029' },
    { id: 2030, name: '2030' },
    { id: 2031, name: '2031' },
    { id: 2032, name: '2032' },
    { id: 2033, name: '2033' },
    { id: 2034, name: '2034' },
  ];
  checkboxModel = {
    left: true,
    middle: false,
    right: false
  };

  
  constructor(private _coreConfigService: CoreConfigService,
     private _authenticationService: AuthenticationService,
     private _router: Router,
      private toastrService: ToastrService, private userService: UserService) {
      // this.stripe = Stripe('pk_test_krO93K0IJTYIZQI4Kji8oDtK'); // Replace with your Stripe public key
    this.user = window.localStorage.getItem('currentUser') && JSON.parse(window.localStorage.getItem('currentUser')) ||  window.sessionStorage.getItem('currentUser') && JSON.parse(window.sessionStorage.getItem('currentUser'));
    if(window.sessionStorage.getItem('currentUser')){
      window.sessionStorage.removeItem('currentUser');
      this.isAfterSingup = true;
    }
    // Configure the layout
    this._coreConfigService.config = {
      layout: {
        navbar: {
          hidden: true
        },
        footer: {
          hidden: true
        },
        menu: {
          hidden: true
        },
        customizer: false,
        enableLocalStorage: false
      }
    };
  }

  /**
   * On init
   */
  ngOnInit() {
    this.contentHeader = {
      headerTitle: 'Dashboard',
      actionButton: false,
      headerRight: false,
    }
    this.navbar = {
      hidden: false,
    }
  }
 
  ngAfterViewInit(): void {
    this.sellerProfile = this.sellerProfile;
  }

  ngAfterContentChecked(): void {
    this.sellerProfile = this.sellerProfile;
  }

  logout() {
    this._authenticationService.logout();
    this._router.navigate(['/login']);
  }

  
  goToNextStep(){
    if(this.phone && this.lastName && this.firstName && this.country){
      this.getSellerProfile = false;
      this.subscriptionPacakge = true;
    }else{
      this.toastrService.error('Please enter all fields.','');
    }
  }
  goToFinalStep(){
      this.subscriptionPacakge = false;
      this.cardDetail = true;
  }

  payment(){
    if(this.cvc && this.cardNumber && this.cardname && this.selectedMonth && this.selectedMonth){
      let data = {
        'cvc': this.cvc,
        'number': this.cardNumber ,
        'exp_month': this.selectedMonth,
         'exp_year': this.selectedYear
      }
      this.userService.createStripeToken(data).subscribe({
        next: (value)=> {
          let subscriptionData = {
            '_id': this.user._id ,
            'email':this.user.email,
            'name': this.user.companyName,
            'token': value.id,
            'firstName' : this.firstName,
            'lastName' : this.lastName,
            'country' : this.country,
            'postalCode' : this.postalCode,
            'phone': this.phone,
            'priceId': this.priceId
          }
          this.userService.createSubscriptionCustomer(subscriptionData).subscribe({
            next: (res)=> {
              console.log(res);
              if(this.isAfterSingup){
                this.toastrService.success('You have successfully subscribed.')
                this._router.navigate(['/login']);
              }else{
                this.user['payment']=true;
                this._authenticationService.updateUserData(this.user);
                this._router.navigate(['/pages/seller/home']);
              }
             
            },
          })
        },
      })
      // this.createToken();
      //   const stripe = require('stripe')('sk_test_HzHrz8pdKuKRvc7ZCfkNySw3');

    //   const token = this.stripe.tokens.create({
    //     card: {
    //       number: '4242424242424242',
    //       exp_month: 4,
    //       exp_year: 2024,
    //       cvc: '314',
    //     },
    //   });
    // }else{
    //   this.toastrService.error('Please enter all fields.','');
    }
  }


  // createToken() {

  //   this.stripe.tokens.create('card', {
  //     name: this.cardname,
  //     number: this.cardNumber,
  //     exp_month: this.selectedMonth,
  //     exp_year: this.selectedYear,
  //     cvc: this.cvc,
  //   }).then(result => {
  //     if (result.error) {
  //       // Handle error
  //     } else {
  //       const token = result.token;
  //       // Send token to your server to complete the charge
  //     }
  //   });
  // }
  priceId = 'price_1MyGJ2DmnN3Lb8U75UesYONG';
  charges = '9.99';
  discount = '0.00';
  total = '9.99';
  selectPackage(){
   if(this.radioModel === 1){
    this.priceId = 'price_1MyGJ2DmnN3Lb8U75UesYONG';
    this.charges = '9.99';
    this.discount = '0.00';
    this.total = '9.99';
   } else{
    this.priceId = 'price_1MyGHvDmnN3Lb8U7i0pZEcMZ'
    this.charges = '8.25';
    this.discount = '20.88';
    this.total = '99.00';
   }
  }
}
