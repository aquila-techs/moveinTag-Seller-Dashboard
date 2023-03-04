import { Component, OnInit } from '@angular/core'
import { OrderService } from '@core/services/services/order.service';

@Component({
  selector: 'app-ordermanagement',
  templateUrl: './ordermanagement.component.html',
  styleUrls: ['./ordermanagement.component.scss']
})
export class OrdermanagementComponent implements OnInit {
  public userId = '';
  constructor(private orderService: OrderService) {
    this.userId = JSON.parse(window.localStorage.getItem('currentUser'))._id;
  }

  public contentHeader: object;

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit() {

    this.contentHeader = {
      headerTitle: 'Manage Orders',
      actionButton: true,
      headerRight: false,
      breadcrumb: {
        type: '',
        links: [
          // {
          //   name: 'Home',
          //   isLink: true,
          //   link: '/'
          // },
          // {
          //   name: 'Sample',
          //   isLink: false
          // }
        ]
      }
    }
    this.getUserActiveOrder();
    this.getUSerCanceledOrder();
    this.getUserCompletedOrders();
    this.getUserlatedOrders();

  }

  public completedOrders = [];
  public activeOrders = [];
  public cancelledOrder = [];
  public latedOrder = [];
  getUserCompletedOrders(){
    let queryParams = '?userId='+this.userId+'&status=COMPLETED';
    this.orderService.getAllCompleteSellerOrders(queryParams)
    .subscribe(res => {
      this.completedOrders =  res[0].results;
    })
  }

  getUserlatedOrders(){
    let queryParams = '?userId='+this.userId+'&status=LATE';
    this.orderService.getAllCompleteSellerOrders(queryParams)
    .subscribe(res => {
      this.latedOrder =  res[0].results;
    })
  }

  getUserActiveOrder(){
    let queryParams = '?userId='+this.userId+'&status=ACTIVE';
    this.orderService.getAllActiveSellerOrders(queryParams)
    .subscribe(res => {
      this.activeOrders =  res[0].results;
    })
  }
  
  getUSerCanceledOrder(){
    let queryParams = '?userId='+this.userId+'&status=CANCELLED';
    this.orderService.getAllCancelledSellerOrders(queryParams)
    .subscribe(res => {
      this.cancelledOrder =  res[0].results;
    })
  }

  changeOrderStatus(order, event){
    let data = {
      "orderId":order._id,
      "status": event.target.value
    }
    this.orderService.changeOrderStatus(data)
    .subscribe(res => {
      this.getUserActiveOrder();
      this.getUSerCanceledOrder();
      this.getUserCompletedOrders();
      this.getUserlatedOrders();
    })
  }
}
