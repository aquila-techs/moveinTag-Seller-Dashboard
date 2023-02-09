import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';

@Component({
  selector: 'app-ecommerce-shop',
  templateUrl: './ecommerce-shop.component.html',
  styleUrls: ['./ecommerce-shop.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'ecommerce-application' }
})
export class EcommerceShopComponent implements OnInit {
  // public
  public contentHeader: object;
  public shopSidebarToggle = false;
  public shopSidebarReset = false;
  public gridViewRef = true;
  public products = [
    {
      id: 1,
      name: 'VicTsing Wireless Mouse,',
      slug: 'vic-tsing-wireless-mouse-1',
      description:
        'After thousands of samples of palm data, we designed this ergonomic mouse. The laptop mouse has a streamlined arc and thumb rest to help reduce the stress caused by prolonged use of the laptop mouse.',
      brand: 'VicTsing',
      price: 10.99,
      image: 'assets/images/medicine/disprin.png',
      hasFreeShipping: true,
      rating: 3
    },
    {
      id: 2,
      name: 'Bose Frames Tenor - Rectangular Polarized, Bluetooth Audio Sunglasses',
      slug: 'bose-frames-tenor-rectangular-polarized-bluetooth-audio-sunglasses-2',
      description:
        'Redesigned for luxury — Thoughtfully refined and strikingly elegant, the latest Bose sunglasses blend enhanced features and designs for an elevated way to listen',
      brand: 'Bose',
      price: 249.0,
      image: 'assets/images/medicine/disprin.png',
      hasFreeShipping: false,
      rating: 4
    },
    {
      id: 3,
      name: 'Willful Smart Watch for Men Women 2020,',
      slug: 'willful-smart-watch-for-men-women-2020-3',
      description:
        'Are you looking for a smart watch, which can not only easily keep tracking of your steps, calories, heart rate and sleep quality, but also keep you informed of incoming calls.',
      brand: 'Willful',
      price: 29.99,
      image: 'assets/images/medicine/disprin.png',
      hasFreeShipping: true,
      rating: 5
    }];
  public wishlist;
  public cartList;
  public page = 1;
  public pageSize = 9;
  public searchText = '';

  /**
   *
   * @param {CoreSidebarService} _coreSidebarService
   * @param {EcommerceService} _ecommerceService
   */
  constructor(private _coreSidebarService: CoreSidebarService) {}

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Toggle Sidebar
   *
   * @param name
   */
  toggleSidebar(name): void {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  /**
   * Update to List View
   */
  listView() {
    this.gridViewRef = false;
  }

  /**
   * Update to Grid View
   */
  gridView() {
    this.gridViewRef = true;
  }

  /**
   * Sort Product
   */
  // sortProduct(sortParam) {
  //   this._ecommerceService.sortProduct(sortParam);
  // }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    
    // Subscribe to ProductList change

    // this._ecommerceService.onProductListChange.subscribe(res => {
    //   this.products = res;
    //   this.products.isInWishlist = false;
    // });

    // Subscribe to Wishlist change
    // this._ecommerceService.onWishlistChange.subscribe(res => (this.wishlist = res));

    // Subscribe to Cartlist change
    // this._ecommerceService.onCartListChange.subscribe(res => (this.cartList = res));

    // update product is in Wishlist & is in CartList : Boolean
    // this.products.forEach(product => {
    //   product.isInWishlist = this.wishlist.findIndex(p => p.productId === product.id) > -1;
    //   product.isInCart = this.cartList.findIndex(p => p.productId === product.id) > -1;
    // });

    // content header
    this.contentHeader = {
      headerTitle: 'Shop',
      actionButton: true,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Home',
            isLink: true,
            link: '/'
          },
          {
            name: 'eCommerce',
            isLink: true,
            link: '/'
          },
          {
            name: 'Shop',
            isLink: false
          }
        ]
      }
    };
  }
}
