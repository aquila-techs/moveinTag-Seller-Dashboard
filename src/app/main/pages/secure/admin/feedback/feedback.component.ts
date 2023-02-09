import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CoreConfigService } from '@core/services/config.service';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { ProductService } from '@core/services/admin-services/product.service';
import { Router } from '@angular/router';
import { PromotionService } from '@core/services/admin-services/promotion.service';
import { FeedbackService } from '@core/services/admin-services/feedback.service';


@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FeedbackComponent implements OnInit {
  // Public
  public sidebarToggleRef = false;
  public sfList = [];
  public bfList = [];
  public ColumnMode = ColumnMode;
  public temp = [];

  public searchValue = '';
  public sellerFeedback: any;
  public sfpageSize=30;
  public sfpageNo=1;
  public sftotal=0;


  public buyerFeedback: any;
  public bfpageSize=30;
  public bfpageNo=1;
  public bftotal=0;
  // Decorator
  @ViewChild(DatatableComponent) table: DatatableComponent;

  // Private
  private tempData = [];
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   * @param {UserListService} _userListService
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(
    private _coreSidebarService: CoreSidebarService,
    private _coreConfigService: CoreConfigService,
    private feedbackService: FeedbackService,
    private router: Router
  ) {
    this._unsubscribeAll = new Subject();
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe config change
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      //! If we have zoomIn route Transition then load datatable after 450ms(Transition will finish in 400ms)
      if (config.layout.animation === 'zoomIn') {
        setTimeout(() => {
        }, 450);
      } else {
      }
    });
    let queryParams = '?pageSize='+this.sfpageSize+'&pageNo='+this.sfpageNo+'&isSeller=true';
    this.feedbackService.getAllSellersFeedback(queryParams).subscribe({
      next: (res)=>{
          this.sfList = res[0].results;
          if(res[0].count && res[0].count.length > 0){
            this.sftotal = res[0].count[0].totalCount;
          }else{
            this.sftotal = 0;
          }
      }
    })

    queryParams = '?pageSize='+this.bfpageSize+'&pageNo='+this.bfpageNo+'&isBuyer=true';
    this.feedbackService.getAllBuyerFeedback(queryParams).subscribe({
      next: (res)=>{
          this.bfList = res[0].results;
          if(res[0].count && res[0].count.length > 0){
            this.bftotal = res[0].count[0].totalCount;
          }else{
            this.bftotal = 0;
          }
      }
    })
  }
  loadPageSF(event){
    this.sfpageNo = event;
    let queryParams = '?pageSize='+this.sfpageSize+'&pageNo='+event+'&isSeller=true';
    this.feedbackService.getAllSellersFeedback(queryParams).subscribe({
      next: (res)=>{
        this.sfList = res[0].results;
        
        if(res[0].count && res[0].count.length > 0){
          this.sftotal = res[0].count[0].totalCount;
        }else{
          this.sftotal = 0;
        }
      },
      error: (err)=>{

      }
    })
  }


  loadPageBF(event){
    this.bfpageNo = event;
    let queryParams = '?pageSize='+this.bfpageSize+'&pageNo='+event+'&isBuyer=true';
    this.feedbackService.getAllSellersFeedback(queryParams).subscribe({
      next: (res)=>{
        this.bfList = res[0].results;
        
        if(res[0].count && res[0].count.length > 0){
          this.bftotal = res[0].count[0].totalCount;
        }else{
          this.bftotal = 0;
        }
      },
      error: (err)=>{
      }
    })
  }
  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
