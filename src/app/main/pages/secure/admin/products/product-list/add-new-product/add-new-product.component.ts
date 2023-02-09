import { Component, OnInit, OnDestroy, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FlatpickrOptions } from 'ng2-flatpickr';
import { cloneDeep } from 'lodash';
import { ProductService } from '@core/services/admin-services/product.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-new-product',
  templateUrl: './add-new-product.component.html',
  styleUrls: ['./add-new-product.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddNewProductComponent implements OnInit, OnDestroy {
  // Public
  public url = this.router.url;
  public urlLastValue;
  public categories: any;
  public product: any = {
    'name': '',
    'categoryId': '',
    'price': '',
    'imageUrl': '',
    'sku': '',
    'description': ''
  };
  public currentRow: any = null;
  public tempRow;
  public avatarImage: string = '';
  public selectedImage = null;
  @ViewChild('productForm') productForm: NgForm;

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {Router} router
   * @param {UserEditService} _userEditService
   */
  constructor(private router: Router, private productService: ProductService, 
    private toastrService: ToastrService) {
    this._unsubscribeAll = new Subject();
    this.urlLastValue = this.url.substr(this.url.lastIndexOf('/') + 1);
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Reset Form With Default Values
   */
  resetFormWithDefaultValues() {
    this.productForm.resetForm();
  }

  /**
   * Upload Image
   *
   * @param event
   */
  uploadImage(event: any) {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      this.selectedImage = event.target.files[0]
      reader.onload = (event: any) => {
        this.avatarImage = event.target.result;
      };

      reader.readAsDataURL(event.target.files[0]);
    }
  }

  /**
   * Submit
   *
   * @param form
   */
  submit(form) {
    if (this.product.price && this.product.categoryId && this.product.name) {
      let formData = new FormData();
      if(this.selectedImage){
        formData.append('productImages',this.selectedImage)
      }
      formData.append('name',this.product.name);
      formData.append('price',this.product.price); 
      formData.append('description',this.product.description);
      formData.append('sku',this.product.sku);
      formData.append('categoryId',this.product.categoryId);
      this.productService.addNewProdcut(formData).subscribe({
        next: (res)=>{
          console.log(res);
          this.toastrService.success('Product Successfully Created.');
          this.router.navigate(['/pages/admin/products'])
        }
      })
    }
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  /**
   * On init
   */
  ngOnInit(): void {
    this.productService.getAllCategories().subscribe({
      next: (res)=>{
        this.categories = res;
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
