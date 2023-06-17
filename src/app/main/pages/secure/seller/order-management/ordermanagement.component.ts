import { Component, OnInit } from '@angular/core'
import { OrderService } from '@core/services/services/order.service';
import { NotificationsService } from 'app/layout/components/navbar/navbar-notification/notifications.service';

@Component({
  selector: 'app-ordermanagement',
  templateUrl: './ordermanagement.component.html',
  styleUrls: ['./ordermanagement.component.scss']
})
export class OrdermanagementComponent implements OnInit {
  public userId = '';
  constructor(private orderService: OrderService, private notificationService: NotificationsService) {
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

  }

  public completedOrders = [];
  public completedOrderTotal = 0;
  public completedOrderPage = 1;
  public activeOrders = [];
  public activeOrderTotal = 0;
  public activeOrderPage = 1;
  public pageSize = 10;
  public cancelledOrder = [];
  public cancelledOrderTotal = 0;
  public cancelledOrderPage = 1;
  public latedOrder = [];
  getUserCompletedOrders(){
    let queryParams = '?userId='+this.userId+'&status=COMPLETED'+'&pageSize='+this.pageSize+'&pageNo='+this.completedOrderPage+'&sortBy=updatedAt&order=desc';;
    this.orderService.getAllCompleteSellerOrders(queryParams)
    .subscribe(res => {
      this.completedOrderTotal = res[0]['count'][0].totalCount;
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
    let queryParams = '?userId='+this.userId+'&status=ACTIVE'+'&pageSize='+this.pageSize+'&pageNo='+this.activeOrderPage+'&sortBy=updatedAt&order=desc';
    this.orderService.getAllActiveSellerOrders(queryParams)
    .subscribe(res => {
      this.activeOrderTotal = res[0]['count'][0].totalCount;
      this.activeOrders =  res[0].results;
    })
  }
  
  getUSerCanceledOrder(){
    let queryParams = '?userId='+this.userId+'&status=CANCELLED'+'&pageSize='+this.pageSize+'&pageNo='+this.cancelledOrderPage+'&sortBy=updatedAt&order=desc';
    this.orderService.getAllCancelledSellerOrders(queryParams)
    .subscribe(res => {
      this.cancelledOrderTotal = res[0]['count'][0].totalCount;
      this.cancelledOrder =  res[0].results;
    })
  }

  changeOrderStatus(order, event, type){
    let data = {
      "orderId":order._id,
      "status": event.target.value
    }

    this.orderService.changeOrderStatus(data)
    .subscribe(res => {
      if(order.buyer._id){
        let data={
          'heading': order.orderNum + ' Order Status Changed To '+event.target.value,
          'message': 'Please check orders page for detail.',
          'receiverId': order.buyer._id,
          'senderId':  order.seller._id
        }
        this.notificationService.sendMessage(data, order.buyer._id)
      }
      // this.getUserActiveOrder();
      if(type === 'active'){
        this.getUserActiveOrder();
      }
      if(type === 'cancelled'){
        this.getUSerCanceledOrder();
      }
    })
  }

  loadCompletedPage(event){
    this.completedOrderPage = event;
    this.getUserCompletedOrders();
  }
  loadCancelledPage(event){
    this.cancelledOrderPage = event;
    this.getUSerCanceledOrder();
  }
  loadActivePage(event){
    this.activeOrderPage = event;
    this.getUserActiveOrder();
  }
}
