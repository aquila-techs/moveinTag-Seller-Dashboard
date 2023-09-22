import { Component, OnInit } from '@angular/core'
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { OrderService } from '@core/services/services/order.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationsService } from 'app/layout/components/navbar/navbar-notification/notifications.service';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-ordermanagement',
  templateUrl: './ordermanagement.component.html',
  styleUrls: ['./ordermanagement.component.scss']
})
export class OrdermanagementComponent implements OnInit {
  public userId = '';
  public baseURL = environment.serverURL;
  constructor(private modalService: NgbModal, private http: HttpClient,
    private _formBuilder: UntypedFormBuilder,
    private orderService: OrderService, private notificationService: NotificationsService) {
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
    this.completedOrderAmmountFormBuilder();
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
  public completedOrderAmmountForm: UntypedFormGroup;
  public searchText: string = "";

  onSubmitSearch() {
    const Text = this.searchText

    this.http.post("https://api.moventag.com/order/searchSellerOrders", {
      orderNum: Text
    }).subscribe({
      next: (res: any) => {

        if (res.length < 1) {
          this.activeOrderTotal = 0;
          this.activeOrders = [];
        } else {
          this.activeOrders = [res];
          this.activeOrderTotal = res.length;
        }

      }
    })
  }

  onSubmitClear() {
    this.getUserActiveOrder();
  }

  getUserCompletedOrders() {
    let queryParams = '?userId=' + this.userId + '&status=COMPLETED' + '&pageSize=' + this.pageSize + '&pageNo=' + this.completedOrderPage + '&sortBy=updatedAt&order=desc';;
    this.orderService.getAllCompleteSellerOrders(queryParams)
      .subscribe(res => {

        if (res[0].results.length > 0) {
          this.completedOrderTotal = res[0]['count'][0].totalCount;
          this.completedOrders = res[0].results;
        } else {
          this.completedOrderTotal = 0;
          this.completedOrders = [];
        }
      })
  }

  getUserlatedOrders() {
    let queryParams = '?userId=' + this.userId + '&status=LATE';
    this.orderService.getAllCompleteSellerOrders(queryParams)
      .subscribe(res => {
        this.latedOrder = res[0].results;
      })
  }

  getUserActiveOrder() {
    let queryParams = '?userId=' + this.userId + '&status=ACTIVE' + '&pageSize=' + this.pageSize + '&pageNo=' + this.activeOrderPage + '&sortBy=updatedAt&order=desc';
    this.orderService.getAllActiveSellerOrders(queryParams)
      .subscribe(res => {
        if (res[0].results.length > 0) {
          this.activeOrderTotal = res[0]['count'][0].totalCount;
          this.activeOrders = res[0].results;
        } else {
          this.activeOrderTotal = 0;
          this.activeOrders = [];
        }

      })
  }

  getUSerCanceledOrder() {
    let queryParams = '?userId=' + this.userId + '&status=CANCELLED' + '&pageSize=' + this.pageSize + '&pageNo=' + this.cancelledOrderPage + '&sortBy=updatedAt&order=desc';
    this.orderService.getAllCancelledSellerOrders(queryParams)
      .subscribe(res => {
        if (res[0].results.length > 0) {
          this.cancelledOrderTotal = res[0]['count'][0].totalCount;
          this.cancelledOrder = res[0].results;
        } else {
          this.cancelledOrderTotal = 0;
          this.cancelledOrder = [];
        }

      })
  }
  selectedOrder: any = [];
  modalOpenVC(modalVC) {
    this.modalService.open(modalVC, {
      centered: true,
      size: 'lg' // size: 'xs' | 'sm' | 'lg' | 'xl'
    });
  }
  openOrderDetailPopup(modalVC, selectedOrders) {
    this.selectedOrder = selectedOrders;

    this.modalService.open(modalVC, {
      centered: true,
      size: 'lg' // size: 'xs' | 'sm' | 'lg' | 'xl'
    });
  }
  public selectedOrderForComplete: any;
  public selectedType: any;
  changeOrderStatus(order, event, type, modalComplete) {
    if (event.target.value === 'COMPLETED') {
      this.selectedOrderForComplete = order;
      this.selectedType = type;
      event.target.value = 'ACTIVE';
      this.modalOpenVC(modalComplete);
      return;
    }
    let data = {
      "orderId": order._id,
      "status": event.target.value
    }

    this.orderService.changeOrderStatus(data)
      .subscribe(res => {
        this.completedOrderAmmountFormBuilder();
        if (order.buyer._id) {
          let data = {
            'heading': order.orderNum + ' Order Status Changed To ' + event.target.value,
            'message': 'Please check orders page for detail.',
            'receiverId': order.buyer._id,
            'senderId': order.seller._id
          }
          this.notificationService.sendMessage(data, order.buyer._id)
        }
        // this.getUserActiveOrder();
        if (type === 'active') {
          this.getUserActiveOrder();
        }
        if (type === 'cancelled') {
          this.getUSerCanceledOrder();
        }
      })
  }


  changeOrderStatusComplete() {
    if (this.completedOrderAmmountForm.invalid) {
      return;
    }

    let data = {
      "orderId": this.selectedOrderForComplete._id,
      "status": 'COMPLETED',
      "ammount": this.completedOrderAmmountForm.value.ammount === "" ? 0 : this.completedOrderAmmountForm.value.ammount
    }

    this.orderService.changeOrderStatus(data)
      .subscribe(res => {
        this.completedOrderAmmountFormBuilder();
        this.modalService.dismissAll();

        if (this.selectedOrderForComplete.buyer._id) {
          let data = {
            'heading': this.selectedOrderForComplete.orderNum + ' Order Status Changed To ' + 'COMPLETED',
            'message': 'Please check orders page for detail.',
            'receiverId': this.selectedOrderForComplete.buyer._id,
            'senderId': this.selectedOrderForComplete.seller._id
          }
          this.notificationService.sendMessage(data, this.selectedOrderForComplete.buyer._id)
        }
        // this.getUserActiveOrder();
        if (this.selectedType === 'active') {
          this.getUserActiveOrder();
        }
        if (this.selectedType === 'cancelled') {
          this.getUSerCanceledOrder();
        }
        this.selectedOrderForComplete = null;
        this.selectedType = null;
      })
  }

  loadCompletedPage(event) {
    this.completedOrderPage = event;
    this.getUserCompletedOrders();
  }
  loadCancelledPage(event) {
    this.cancelledOrderPage = event;
    this.getUSerCanceledOrder();
  }
  loadActivePage(event) {
    this.activeOrderPage = event;
    this.getUserActiveOrder();
  }

  completedOrderAmmountFormBuilder() {
    this.completedOrderAmmountForm = this._formBuilder.group({
      ammount: [''],
    });
  }
}
