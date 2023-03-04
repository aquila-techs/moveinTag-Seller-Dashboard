import { Component, OnInit } from '@angular/core'
import { OrderService } from '@core/services/services/order.service';
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
  constructor(private modalService: NgbModal,
     private orderService: OrderService) {
      this.userId = JSON.parse(window.localStorage.getItem('currentUser'))._id;
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
      headerTitle: 'Consumers',
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
    let queryParams = '?userId='+this.userId+'&status=QUOTE';
    this.orderService.getAllQuotesOrders(queryParams)
    .subscribe(res => {
      this.userQuote =  res[0].results;
    })
  }
  changeOrderStatus(order, status){
    let data = {
      "orderId":order._id,
      "status": status
    }
    this.orderService.changeOrderStatus(data)
    .subscribe(res => {
      this.modalService.dismissAll();
      this.getAllQuotesOrders();
    })
  }
}
