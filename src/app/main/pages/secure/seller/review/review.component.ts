import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { ColumnMode } from "@swimlane/ngx-datatable";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { rows } from "./row";
import { AdminService } from "@core/services/services/admin.service";
import { CoreConfigService } from "@core/services/config.service";
import { AuthenticationService } from "@core/services/authentication.service";
import { OrderService } from "@core/services/services/order.service";
import { environment } from "environments/environment";
import { ToastrService } from "ngx-toastr";
import { HttpClient } from "@angular/common/http";
import { CurrencyService } from "@core/services/currency.service";

@Component({
  selector: "app-review",
  templateUrl: "./review.component.html",
  styleUrls: ["./review.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ReviewComponent implements OnInit {
  public contentHeader: object;
  @ViewChild("myTable") table: any;

  rows = rows;
  columns = [];
  expanded: any = {};
  timeout: any;
  ColumnMode = ColumnMode;
  user: any;
  userQuote: any;
  searchText: string = "";
  public iconsCurrentRate = 0;

  constructor(
    private modalService: NgbModal,
    private authenticationService: AuthenticationService,
    private adminService: AdminService,
    private _coreConfigService: CoreConfigService,
    private orderService: OrderService,
    private tosterService: ToastrService,
    private http: HttpClient,
    public currencyService: CurrencyService
  ) {
    this.authenticationService.currentUser.subscribe((x) => (this.user = x));
  }
  onPage(event) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      console.log("paged!", event);
    }, 100);
  }

  // fetch(cb) {
  //   const req = new XMLHttpRequest();
  //   req.open('GET', `assets/data/100k.json`);

  //   req.onload = () => {
  //     cb(JSON.parse(req.response));
  //     console.log(JSON.parse(req.response))
  //   };

  //   req.send();
  // }

  toggleExpandRow(row) {
    console.log("Toggled Expand Row!", row);
    this.table.rowDetail.toggleExpandRow(row);
  }

  onDetailToggle(event) {
    console.log("Detail Toggled", event);
  }
  public selectOrder: any;
  public baseURL = environment.apiUrl;
  public readOnlyRating = false;
  public reviewImages = "";
  public ratingCount = 0;
  public recencyCount = 0;
  public reputationCount = 0;
  public responsivenessCount = 0;
  modalOpenVC(modalVC, selectOrder) {
    this.selectOrder = selectOrder;
    this.modalService.open(modalVC, {
      centered: true,
    });
    if (this.selectOrder) {
      this.ratingCount = this.selectOrder.ratingCount;
      this.recencyCount = this.selectOrder.recencyCount;
      this.reputationCount = this.selectOrder.reputationCount;
      this.responsivenessCount = this.selectOrder.responsivenessCount;
      this.description = this.selectOrder.description;
      this.reviewImages = this.selectOrder?.reviewsImages;
      this.readOnlyRating = true;
    }
  }

  onSubmitSearch() {
    const Text = this.searchText;
    this.http
      .post(`${environment.apiUrl}reviews/searchSellerReview`, {
        sellerId: this.user._id,
        userReviewed: true,
        text: Text,
        sortBy: "createdAt",
        pageNo: 1,
        pageSize: 1000000,
        order: "desc",
        status: 0,
      })
      .subscribe({
        next: (res: any) => {
          if (res.length < 1) {
            this.userQuote = [];
            return;
          }
          this.userQuote = res[0].results;
          this.total = res[0]["count"][0].totalCount;
        },
      });
  }

  onSubmitClear() {
    this.searchText = "";
    this.getAllReviews();
  }

  /**
   * On init
   */
  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: "Reviews",
      actionButton: false,
      breadcrumb: {
        type: "",
        links: [
          // {
          //   name: 'Home',
          //   isLink: true,
          //   link: '/'
          // },
          // {
          //   name: 'Charts & Maps',
          //   isLink: true,
          //   link: '/'
          // },
          // {
          //   name: 'Chartjs',
          //   isLink: false
          // }
        ],
      },
    };
    this.getAllReviews();
  }

  public pageSize = 10;
  public pageNo = 1;
  public total = 0;

  getAllReviews() {
    let queryParams =
      "?sellerId=" +
      this.user._id +
      "&pageSize=" +
      this.pageSize +
      "&pageNo=" +
      this.pageNo +
      "&sortBy=createdAt&order=desc";
    this.orderService.getAllReviews(queryParams).subscribe((res) => {
      console.log(res[0].results);
      this.userQuote = res[0].results;
      this.total = res[0]["count"][0].totalCount;
    });
  }

  loadPage(event) {
    this.pageNo = event;
    this.getAllReviews();
  }

  changeOrderStatus() {
    let data = {
      orderId: this.selectOrder._id,
      status: "DELETE",
      buyer: true,
    };
    this.orderService.changeOrderStatus(data).subscribe((res) => {
      this.modalService.dismissAll();
      this.loadPage(this.pageNo);
    });
  }
  public description = "";

  convert(amount) {
    return this.currencyService.convert(amount);
  }
}
