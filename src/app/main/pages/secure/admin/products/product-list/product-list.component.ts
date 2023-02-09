import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CoreConfigService } from '@core/services/config.service';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { ProductService } from '@core/services/admin-services/product.service';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProductListComponent implements OnInit {
  // Public
  public sidebarToggleRef = false;
  public products = [];
  public ColumnMode = ColumnMode;
  public temp = [];
  public noOfPagesForExport = [];
  public selectedPageForExport = 1;
  public searchValue = '';
  public rows: any;
  public pageSize=30;
  public pageNo=1;
  public total=0;
  public basePath = environment.apiUrl;
  public isCollapseSearchSection = true;
  public isCollapseExportSection = true;
  public selectedProduct: any = null;
  public totlalProducts = 0; 
  public searchProductForm: FormGroup;
  public categories = [
  {
      _id: "635565afd7cb9f568295d74c",
      title: "Medicine"
    },{
      _id: "635565afd7cb9f568295d74d",
      title: "Beauty & Skin Care"
    },{
      _id: "635565afd7cb9f568295d74e",
      title: "Medical Equipment"
    }
  ]
  public categoriesIds = ["635565afd7cb9f568295d74c", "635565afd7cb9f568295d74d", "635565afd7cb9f568295d74e"]
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
    private productService: ProductService,
    private router: Router,
    private _formBuilder: FormBuilder,
    private modalService: NgbModal

  ) {
    this._unsubscribeAll = new Subject();
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------
 
  // 
  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  /**
   * On init
   */
  ngOnInit(): void {
    this.searchProductForm = this._formBuilder.group({
      productName: [''],
      sku: [''],
      price:[''],
      orderBy:['asc'],
      categories:  this._formBuilder.array(this.categoriesIds.map(x => !1)),
      sortBy: ['name']

    });

    // Subscribe config change
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      //! If we have zoomIn route Transition then load datatable after 450ms(Transition will finish in 400ms)
      if (config.layout.animation === 'zoomIn') {
        setTimeout(() => {
          // this._userListService.onUserListChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
          //   this.rows = response;
          //   this.tempData = this.rows;
          // });
        }, 450);
      } else {
        // this._userListService.onUserListChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
        //   this.rows = response;
        //   this.tempData = this.rows;
        // });
      }
    });
    let queryParams = '?pageSize='+this.pageSize+'&pageNo='+this.pageNo;
    this.productService.getAllProucts(queryParams).subscribe({
      next: (res)=>{
          this.products = res[0].results;
          this.products.map(elem => {
            if(!elem.imageUrl){
              elem['imageUrl'] = '';
            }
          })
          if(res[0].count && res[0].count.length > 0){
            this.total = res[0].count[0].totalCount;
            this.totlalProducts = res[0].count[0].totalCount;
            if(this.totlalProducts > 20000){
              let totlalProd =this.totlalProducts;
              for(let index = 0; totlalProd/20000 > 0; index++ ){
                this.noOfPagesForExport.push(index+1);
                totlalProd = totlalProd-20000;
              }
            }else{
              this.noOfPagesForExport.push(1);
              this.selectedPageForExport = 1;
            }
          }else{
            this.total = 0;
          }
      }
    })
  }
  convertToValue(key: string) {
    return this.searchProductForm.value[key].map((x, i) => x && this[key][i]).filter(x => !!x);
  }
  loadPage(event){
    this.pageNo = event;
    let queryParams = '?pageSize='+this.pageSize+'&pageNo='+event;
    if(this.searchValue.length > 3){
      queryParams = queryParams + '&q='+this.searchValue; 
    }
    this.productService.getAllProucts(queryParams).subscribe({
      next: (res)=>{
        this.products = res[0].results;
        this.products.map(elem => {
          if(!elem.imageUrl){
            elem['imageUrl'] = '';
          }
        })
        if(res[0].count && res[0].count.length > 0){
          this.total = res[0].count[0].totalCount;
        }else{
          this.total = 0;
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

  public productDetail(product){
    this.productService.setSelectedproduct(product);
    this.router.navigate(['/pages/admin/product-details/' + product._id])
  }

  public productEdit(product){
    this.productService.setSelectedproduct(product);
    this.router.navigate(['/pages/admin/edit-product-detail/' + product._id])
  }

  public searchProduct(){
    const valueToStore = Object.assign({}, this.searchProductForm.value, {
      categories: this.convertToValue('categories')
    });
    console.log(valueToStore)
    // console.log(this.searchProductForm.value)
    // let data = this.searchProductForm.value;
    // if(this.searchValue.length > 3 || this.searchSKU){
      this.pageNo=1;
      let queryParams = '?pageSize='+this.pageSize+'&pageNo='+this.pageNo;
      this.productService.searchProduct(queryParams,valueToStore).subscribe({
        next: (res)=>{
            this.products = res[0].results;
            this.products.map(elem => {
              if(!elem.imageUrl){
                elem['imageUrl'] = '';
              }
            })
            if(res[0].count && res[0].count.length > 0){
              this.total = res[0].count[0].totalCount;
            }else{
              this.total = 0;
            }
        }
      })
    // }else if(this.searchValue.length === 0){
    //   this.pageNo=1;
    //   let queryParams = '?pageSize='+this.pageSize+'&pageNo='+this.pageNo;
    //   this.productService.getAllProucts(queryParams).subscribe({
    //     next: (res)=>{
    //         this.products = res[0].results;
    //         this.products.map(elem => {
    //           if(!elem.imageUrl){
    //             elem['imageUrl'] = '';
    //           }
    //         })
    //         if(res[0].count && res[0].count.length > 0){
    //           this.total = res[0].count[0].totalCount;
    //         }else{
    //           this.total = 0;
    //         }
    //     }
    //   })
    // }
    
  }

  public shortName(name){
    if(name.split(' ').length > 2){
      return name.split(' ')[0]+ " " + name.split(' ')[1];
    }
    return name;
  }

  public exportProducts(){
    let q = "?pageNo="+this.selectedPageForExport;
    this.productService.exportProducts(q).subscribe({
      next: (res)=>{
        if(res.path){
          window.open(environment.apiUrl + res.path, 'blank');
        }
      }
    })
  }

  public productDelete(){
    this.productService.deleteProduct(this.selectedProduct._id).subscribe({
      next: (res)=>{
        let index = this.products.findIndex(x => x._id === this.selectedProduct._id);
        this.products.splice(index,1);

      }
    })
  }

   // modal Open Default
   modalOpenDefault(modalDefault,product) {
    this.selectedProduct = product;
    this.modalService.open(modalDefault, {
      centered: true
    });
  }

}
