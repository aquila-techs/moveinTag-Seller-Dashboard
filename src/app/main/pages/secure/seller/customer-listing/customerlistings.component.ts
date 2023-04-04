import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '@core/services/services/order.service';
import { UserService } from '@core/services/services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-customerlistings',
  templateUrl: './customerlistings.component.html',
  styleUrls: ['./customerlistings.component.scss']
})
export class CustomerlistingsComponent implements OnInit {
  public baseURL = environment.apiUrl;
  public userId = '';
  public category: any  = {};
  public categoryId = '';
  constructor(private modalService: NgbModal,
     private orderService: OrderService,
     private userService: UserService,  private activateRoute: ActivatedRoute,
     private router:Router) {
      this.userId = JSON.parse(window.localStorage.getItem('currentUser'))._id;
      router.events.subscribe((val) => {
        if(this.categoryId !== this.activateRoute.snapshot.paramMap.get('id')){
          this.categoryId = this.activateRoute.snapshot.paramMap.get('id');
          this.userService.getACategory(this.categoryId).subscribe({
            next: (value)=> {
              this.category = value;
              this.getAllQuotesOrders();
            },
          })
        }
    });
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
    
    this.getAllQuotesOrders();
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
  public userQuote:any;
  getAllQuotesOrders(){
    let queryParams = '?&status=QUOTE&searchByQuote=true&categoryId='+this.categoryId+'&userId='+this.userId;
    this.orderService.getAllQuotesOrders(queryParams)
    .subscribe(res => {
      this.userQuote =  res[0].results;
    })
  }
  changeOrderStatus(order, status){
    let data = {
      "orderId":order._id,
      "status": status,
      "sellerId": this.userId
    }
    this.orderService.changeOrderStatus(data)
    .subscribe(res => {
      this.modalService.dismissAll();
      this.getAllQuotesOrders();
    })
  }

  startChat(selectedOrder){
    let body: any = {
      'chatroom':'',
      'userId':'',
      'sellerId':'',
      'orderId':'',
    };
    let emailString = selectedOrder.buyer.email+''+selectedOrder.seller.email;
    body.chatroom = emailString.split('').sort().join('')
    body.userId = selectedOrder.buyer._id;
    body.sellerId = selectedOrder.seller._id;
    body.orderId =selectedOrder._id
    this.userService.createChatRoom(body).subscribe({
      next:(value)=>{
        this.modalService.dismissAll();
        this.router.navigate(['/pages/seller/chats'])
      }
    })

  }
}
