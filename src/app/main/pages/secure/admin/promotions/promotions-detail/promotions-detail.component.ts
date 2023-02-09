import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { PromotionService } from '@core/services/admin-services/promotion.service';
import { environment } from 'environments/environment';

import { SwiperConfigInterface } from 'ngx-swiper-wrapper';


@Component({
  selector: 'app-promotions-detail',
  templateUrl: './promotions-detail.component.html',
  styleUrls: ['./promotions-detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'ecommerce-application' }
})
export class PromotionsDetailComponent implements OnInit {
  // public
  public contentHeader: object;
  public product :any;
  public promotion:any = [];
  public basePath = environment.apiUrl;
  // Swiper
  public swiperResponsive: SwiperConfigInterface = {
    slidesPerView: 3,
    spaceBetween: 50,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },
    breakpoints: {
      1024: {
        slidesPerView: 3,
        spaceBetween: 40
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 30
      },
      640: {
        slidesPerView: 2,
        spaceBetween: 20
      },
      320: {
        slidesPerView: 1,
        spaceBetween: 10
      }
    }
  };

  /**
   * Constructor
   *
   * @param {EcommerceService} _ecommerceService
   */
  constructor(private promotionService: PromotionService, private route: ActivatedRoute) {}

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
  // addToCart(product) {
  //   this._ecommerceService.addToCart(product.id).then(res => {
  //     product.isInCart = true;
  //   });
  // }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      const promotionId = params['id'];

      this.promotionService.getPromotion(promotionId).subscribe({
        next: (res)=>{
          this.promotion = res;
        }
      })
    })

    // // content header
    // this.contentHeader = {
    //   headerTitle: 'Product Details',
    //   actionButton: true,
    //   breadcrumb: {
    //     type: '',
    //     links: [
    //       {
    //         name: 'Home',
    //         isLink: true,
    //         link: '/'
    //       },
    //       {
    //         name: 'eCommerce',
    //         isLink: true,
    //         link: '/'
    //       },
    //       {
    //         name: 'Shop',
    //         isLink: true,
    //         link: '/'
    //       },
    //       {
    //         name: 'Details',
    //         isLink: false
    //       }
    //     ]
    //   }
    // };
  }
}
