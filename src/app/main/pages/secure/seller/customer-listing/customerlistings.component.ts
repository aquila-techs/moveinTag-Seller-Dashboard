import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '@core/services/services/order.service';
import { UserService } from '@core/services/services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationsService } from 'app/layout/components/navbar/navbar-notification/notifications.service';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-customerlistings',
  templateUrl: './customerlistings.component.html',
  styleUrls: ['./customerlistings.component.scss']
})
export class CustomerlistingsComponent implements OnInit {
  public baseURL = environment.serverURL;
  public userId = '';
  public currentUser: any;
  public category: any = {};
  public categoryId = '';
  constructor(private modalService: NgbModal, private http: HttpClient,
    private orderService: OrderService,
    private userService: UserService, private activateRoute: ActivatedRoute,
    private router: Router, private notificationService: NotificationsService) {
    this.currentUser = JSON.parse(window.localStorage.getItem('currentUser'))
    this.userId = this.currentUser._id;
    router.events.subscribe((val) => {
      if (this.categoryId !== this.activateRoute.snapshot.paramMap.get('id')) {
        this.categoryId = this.activateRoute.snapshot.paramMap.get('id');
        this.userService.getACategory(this.categoryId).subscribe({
          next: (value) => {
            // this.category = value;
            this.getAllQuotesOrders();
          },
        })
      }
    });
  }

  public contentHeader: object;
  public progressbarHeight = '.857rem';
  public selectedOrder: any;
  public searchText: string = "";

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

    this.getAllQuotesOrders();
    this.contentHeader = { 
      headerTitle: '',
      actionButton: true,
      headerRight: false,
      breadcrumb: {

      }
    }
  }
  public userQuote: any;
  getAllQuotesOrders() {
    let queryParams = '?&status=QUOTE&searchByQuote=true&categoryId=' + this.categoryId + '&userId=' + this.userId + "&sortBy=createdAt&order=desc";
    this.orderService.getAllQuotesOrders(queryParams)
      .subscribe(res => {
        this.userQuote = res[0].results;
      })
  }
  changeOrderStatus(order, status) {
    let data = {
      "orderId": order._id,
      "status": status,
      "sellerId": this.userId
    }
    if (order.buyer._id) {
      let data = {
        'heading': order.orderNum + ' Lead Approved',
        'message': 'Please check leads page for detail.',
        'receiverId': order.buyer._id,
        'senderId': this.userId
      }
      this.notificationService.sendMessage(data, order.buyer._id)
    }
    this.orderService.changeOrderStatus(data)
      .subscribe(res => {
        this.modalService.dismissAll();
        this.getAllQuotesOrders();
      })
  }

  onSubmitSearch() {
    const Text = this.searchText

    this.http.get(`https://api.moventag.com/order/searchSellerOrdersActiveLeads?status=QUOTE&searchByQuote=true&categoryId=${this.categoryId}&userId=${this.userId}&sortBy=createdAt&order=desc&text=${Text}`).subscribe({
      next: (res: any) => {

        if (res.length < 1) {
          this.userQuote = [];
        } else {
          this.userQuote = res[0].results;
        }

      }
    })
  }

  onSubmitClear() {
    this.searchText = "";
    this.getAllQuotesOrders();
  }


  startChat(selectedOrder) {
    let body: any = {
      'chatroom': '',
      'userId': '',
      'sellerId': '',
      'orderId': '',
    };

    let emailString = selectedOrder.buyer.email + '' + this.currentUser.email;
    body.chatroom = emailString.split('').sort().join('') + '_' + selectedOrder._id
    body.userId = selectedOrder.buyer._id;
    body.sellerId = this.currentUser._id;
    body.orderId = selectedOrder._id
    this.userService.createChatRoom(body).subscribe({
      next: (res) => {
        if (selectedOrder.buyer._id) {
          let data = {
            'heading': selectedOrder.orderNum + ' Lead New Chat Received',
            'message': 'Please check chats page for detail.',
            'receiverId': selectedOrder.buyer._id,
            'senderId': this.currentUser._id,
            'chatRoomId': res._id
          }
          this.notificationService.sendMessage(data, selectedOrder.buyer._id)
        }
        this.modalService.dismissAll();
        window.localStorage.setItem('chatRoomId', res._id);
        this.router.navigate(['/pages/seller/chats'])
      }
    })

  }
}
