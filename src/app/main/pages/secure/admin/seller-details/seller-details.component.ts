import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AdminService } from '@core/services/admin-services/admin.service';
import { OrderService } from '@core/services/admin-services/order.service';
import { ProductService } from '@core/services/admin-services/product.service';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { environment } from 'environments/environment';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-seller-details',
  templateUrl: './seller-details.component.html',
  styleUrls: ['./seller-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SellerDetailsComponent implements OnInit, OnDestroy {
  // public
  public url = this.router.url;
  public lastValue;
  public data;
  public rows = [];
    public products = [];
    public ColumnMode = ColumnMode;
  // private
  private _unsubscribeAll: Subject<any>;
  public basePath = environment.apiUrl;
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
        this.orderService.getAllSellerOrders(queryParam).subscribe({
          next: (value)=> {
              this.rows = value[0].results;
          },
        })
        let queryParamforProduct = '?id='+userId
        this.productService.getAllSellerProducts(queryParamforProduct).subscribe({
          next: (value)=> {
              this.products = value[0].results;
              this.products.map(elem => {
                if(!value.product.imageUrl){
                  value.product['imageUrl'] = '';
                }
              })
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

  sellerDocApproved(id){
    this.adminService.sellerDocApproved({_id: id}).subscribe({
      next: (res)=>{
        this.data = res;
      },
      error: (err)=>{
      }
    })
  }

  sellerDocDisapproved(id){
    this.adminService.sellerDocDisapproved({_id: id}).subscribe({
      next: (res)=>{
        this.data = res;
      },
      error: (err)=>{

      }
    })
  }
}
