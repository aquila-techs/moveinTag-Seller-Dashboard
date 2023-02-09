import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';


@Component({
  selector: 'app-promotion-item',
  templateUrl: './promotion-item.component.html',
  styleUrls: ['./promotion-item.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'ecommerce-application' }
})
export class PromotionItemComponent implements OnInit {
  // Input Decorotor
  @Input() product;
  @Input() isWishlistOpen = false;

  // Public
  public isInCart = false;

  /**
   *
   * @param {EcommerceService} _ecommerceService
   */
  constructor() {}

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Toggle Wishlist
   *
   * @param product
   */
  toggleWishlist(product) {
    // if (product.isInWishlist === true) {
    //   this._ecommerceService.removeFromWishlist(product.id).then(res => {
    //     product.isInWishlist = false;
    //   });
    // } else {
    //   this._ecommerceService.addToWishlist(product.id).then(res => {
    //     product.isInWishlist = true;
    //   });
    // }
  }

  /**
   * Add To Cart
   *
   * @param product
   */
  addToCart(product) {
    // this._ecommerceService.addToCart(product.id).then(res => {
    //   product.isInCart = true;
    // });
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  ngOnInit(): void {}
}
