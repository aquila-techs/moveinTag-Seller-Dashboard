import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '@core/services/authentication.service';
import { CurrencyService } from '@core/services/currency.service';
import { OrderService } from '@core/services/services/order.service';
import { UserService } from '@core/services/services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'environments/environment';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  public baseURL = environment.apiUrl;
  public userId = '';
  public currentUser: any;
  constructor(private modalService: NgbModal,
     private orderService: OrderService,
     private userService: UserService,  private activateRoute: ActivatedRoute,
     private router:Router,
     private toster: ToastrService,
     private authenticateService: AuthenticationService,
     public currencyService: CurrencyService
     ) {
      this.currentUser = JSON.parse(window.localStorage.getItem('currentUser'))
      this.userId = this.currentUser._id;
     }

  public contentHeader: object;
  public progressbarHeight = '.857rem';
    public selectedOrder: any;
  modalOpenVC(modalVC) {
    this.modalService.open(modalVC, {
      centered: true
    });
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit() {
    
    this.getPaymentStatus();
    this.getActiveSubscripton();
    this.contentHeader = {
      headerTitle: '',
      actionButton: true,
      headerRight: false,
      breadcrumb: {
        // type: '',
        // links: [
        //   {
        //     name: 'Home',
        //     isLink: true,
        //     link: '/'
        //   },
        //   {
        //     name: 'Sample',
        //     isLink: false
        //   }
        // ]
      }
    }
  }
  public subscription:any;
  public cardList:any;
  public transactions:any;

  getPaymentStatus(){
    let data = {
      "_id": this.userId
    }
    this.userService.getSubscriptionCustomerInfo(data)
    .subscribe(res => {
      this.subscription =  res;
      this.transactions =  res['subscriptions'].data;
    })
  }
  public customer;
  public paymentMethod;
  getCardListAndDetails(){
    let data = {
      "_id": this.userId
    }
    this.userService.getCustomerCardDetailInfo(data)
    .subscribe(res => {
      this.cardList =  res.cards.data;
      this.customer = res.customer;
    })
  }
  getCustomerPaymentMethodDetailInfo(){
    let data = {
      "_id": this.userId
    }
    this.userService.getCustomerPaymentMethodDetailInfo(data)
    .subscribe(res => {
      this.paymentMethod =  res.data;
    })
  }
  

  getAllTransacrtions(){
    let data = {
      "_id": this.userId
    }
    this.userService.getSubsciptionList(data)
    .subscribe(res => {
      this.transactions =  res;
    })
  }

  cancelPayment(id){
    let data = {
      "_id": this.userId,
      "subscriptionId": id
    }
    this.userService.cancelSubscriptionCustomer(data)
    .subscribe(res => {

      this.toster.success('You have cancelled your subscription. You can still use it till end of subscription date and time.', 'Success!');
      this.modalService.dismissAll();
      this.getPaymentStatus();
    })
  }


  reactivatePayment(id){
    let data = {
      "_id": this.userId,
      "subscriptionId": id
    }
    this.userService.reactivateSubscriptionCustomer(data)
    .subscribe(res => {

      this.toster.success('You have reactivate your subcription.', 'Success!');
      this.modalService.dismissAll();
      this.getPaymentStatus();
    })
  }
  activePayment(){
    let data = {
      "_id": this.userId
    }
    this.userService.activeSubscriptionCustomer(data)
    .subscribe(res => {
      this.modalService.dismissAll();
      this.getPaymentStatus();
    })
  }

  pausePayment(){
    let data = {
      "_id": this.userId
    }
    this.userService.pauseSubscriptionCustomer(data)
    .subscribe(res => {
      this.modalService.dismissAll();
      this.getPaymentStatus();
    })
  }

  getDateFormat(miliseconds){
    return moment(miliseconds*1000).format("DD/MMM/YYYY hh:mm:ss a")
  }
  country: number;
  lastName = "";
  firstName = "";
  phone = "";
  cvc = "";
  cardNumber = "";
  cardname = "";
  selectedMonth: number;
  selectedYear: number;
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
  addNewCard() {
    if (this.cvc && this.cardNumber && this.cardname && this.selectedMonth && this.selectedMonth) {
      let data = {
        'cvc': this.cvc,
        'number': this.cardNumber,
        'exp_month': this.selectedMonth,
        'exp_year': this.selectedYear,
        "_id": this.userId
      }
      this.userService.addNewCard(data).subscribe({
        next: (value) => {
          this.getCardListAndDetails();
          this.modalService.dismissAll();
        }
      })
    }else{
      this.toster.error('Please fill all required fields.');
    }
  }

  deleteCard(id) {
      let data = {
        'cardId': id,
        "_id": this.userId
      }
      this.userService.deleteCard(data).subscribe({
        next: (value) => {
          this.getCardListAndDetails();
        }
      })
    }
    getActiveSubscripton(){
      let data = {
        "_id": this.userId
      }
      this.userService.getSellerActiveSubacription(data).subscribe({
        next: (value) => {
          if(!value){
            let user = this.currentUser;
            this.currentUser.subscriptionStatus = 'cancel';
            this.authenticateService.updateUserData(this.currentUser);
          }else{
            let user = this.currentUser;
            this.currentUser.subscriptionStatus = 'active';
            this.authenticateService.updateUserData(this.currentUser);
          }
        }
      })
    }

    setPaymentMethodAsDefault(id){
      let data = {
        "_id": this.userId,
        "paymentMethodId": id
      }
      this.userService.setPaymentMethodAsDefault(data).subscribe({
        next: (value) => {
          this.getCardListAndDetails();
        }
      })
    }

    convert(amount){
      return this.currencyService.convert(amount);
    }
}
