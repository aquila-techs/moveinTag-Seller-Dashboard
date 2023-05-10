import { Component, OnInit } from '@angular/core'
import { UserService } from '@core/services/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private userService: UserService) {}

  public contentHeader: object;
  public progressbarHeight = '.857rem';

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  public cards: any;
  public analytics: any;
  ngOnInit() {

    this.contentHeader = {
      headerTitle: 'Dashboard',
      actionButton: true,
      breadcrumb: {
        type: '',
        links: [
        ]
      }
    }
    let user = JSON.parse(window.localStorage.getItem('currentUser'));
    this.userService.getSellerAnalytics("sellerId="+user._id).subscribe({
      next: (res: any)=>{
        this.analytics = res;
        this.cards = [
          { name: 'Completed Tickets', price: res['total-completed-orders'] },
          { name: 'Pending Tickets', price: res['total-pending-orders'] },
          { name: 'Canceled Tickets', price:res['total-cancelled-orders']  },
          { name: 'Active Tickets', price: res['total-approved-orders']  },
        ];
        this.analytics['total'] = res['total-completed-orders']+
        res['total-pending-orders']+res['total-cancelled-orders'] +res['total-approved-orders'];

      }
    })
  }
}
