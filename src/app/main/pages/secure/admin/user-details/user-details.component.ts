import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AdminService } from '@core/services/admin-services/admin.service';
import { OrderService } from '@core/services/admin-services/order.service';
import { ProductService } from '@core/services/admin-services/product.service';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { environment } from 'environments/environment';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserDetailsComponent implements OnInit, OnDestroy {
  // public
  public url = this.router.url;
  public lastValue;
  public data;
  public rows = [];
  public products = [];
  public ColumnMode = ColumnMode;
  public basePath = environment.apiUrl;
  // private
  private _unsubscribeAll: Subject<any>;
  @ViewChild('tableRowDetails') tableRowDetails: any;

  /**
   * Constructor
   *
   * @param {Router} router
   * @param {UserViewService} _userViewService
   */
  constructor(private router: Router, private route: ActivatedRoute, private adminService: AdminService, private orderService: OrderService, private productService: ProductService) {
    this._unsubscribeAll = new Subject();
    this.lastValue = this.url.substr(this.url.lastIndexOf('/') + 1);
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  /**
   * On init
   */
  ngOnInit(): void {
    // this._userViewService.onUserViewChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
    //   this.data = response;
    // });
    this.products = [];
    this.route.params.subscribe((params: Params) => {
      const userId = params['id'];
      let queryParam = '?id='+userId
      this.adminService.getProfile(userId).subscribe({
        next: (res)=>{
          this.data = res;
        }
      })
      this.orderService.getAllBuyerOrders(queryParam).subscribe({
        next: (value)=> {
            this.rows = value[0].results;
        },
      })
  })

    // this.data =  {
    //   id: 1,
    //   fullName: 'Galen Slixby',
    //   company: 'Yotz PVT LTD',
    //   role: 'Editor',
    //   username: 'gslixby0',
    //   country: 'El Salvador',
    //   contact: '(479) 232-9151',
    //   email: 'gslixby0@abc.net.au',
    //   currentPlan: 'Enterprise',
    //   status: 'inactive',
    //   avatar: ''
    // };
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
  public shortName(name){
    if(name.split(' ').length > 2){
      return name.split(' ')[0]+ " " + name.split(' ')[1];
    }
    return name;
  }


  rowDetailsToggleExpand(row) {
    this.tableRowDetails.rowDetail.toggleExpandRow(row);
  }
}
