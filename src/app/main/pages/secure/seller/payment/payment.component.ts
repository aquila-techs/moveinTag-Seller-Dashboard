import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '@core/services/services/order.service';
import { UserService } from '@core/services/services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'environments/environment';
import moment from 'moment';

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
     private router:Router) {
      this.currentUser = JSON.parse(window.localStorage.getItem('currentUser'))
      this.userId = this.currentUser._id;
     }

  public contentHeader: object;
  public progressbarHeight = '.857rem';
    public selectedOrder: any;
  modalOpenVC(modalVC, selectedOrders) {
    this.selectedOrder = selectedOrders;
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
  getPaymentStatus(){
    let data = {
      "_id": this.userId
    }
    this.userService.getSubscriptionCustomerInfo(data)
    .subscribe(res => {
      this.subscription =  res;
    })
  }
  cancelPayment(){
    let data = {
      "_id": this.userId
    }
    this.userService.cancelSubscriptionCustomer(data)
    .subscribe(res => {
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
    return moment(miliseconds*1000).format("DD/MMM/YYYY")
  }
  
}
