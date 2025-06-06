import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { OrderService } from "@core/services/services/order.service";
import { UserService } from "@core/services/services/user.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { colors } from "app/colors.const";
import { HttpClient } from "@angular/common/http";
import { environment } from "environments/environment";
import { CurrencyService } from "@core/services/currency.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  @ViewChild("exportEarnigReportForm") exportEarnigReportForm: NgForm;
  public currentDayIndex: number = 0;
  public userId = "";
  public selectedCurrency;

  constructor(
    private userService: UserService,
    private modalService: NgbModal,
    private orderService: OrderService,
    private http: HttpClient,
    public currencyService: CurrencyService
  ) {
    this.userId = JSON.parse(window.localStorage.getItem("currentUser"))._id;
    const currentDate = new Date();
    this.currentDayIndex = currentDate.getDay() + 1;
    if (this.currentDayIndex >= 7) {
      this.currentDayIndex = 0;
    }

    // this._currencyService.getCurrency().subscribe(
    //   value => {
    //     this.selectedCurrency = value;
    //   }
    // )
  }

  public contentHeader: object;
  public progressbarHeight = ".857rem";
  public radioModel = 1;

  // Color Variables
  private successColorShade = "#38b6ff";
  private tooltipShadow = "rgba(0, 0, 0, 0.25)";
  private labelColor = "#6e6b7b";
  private grid_line_color = "rgba(200, 200, 200, 0.2)"; // RGBA color helps in dark layout
  public baseURL = environment.serverURL;

  // ng2-flatpickr options
  public DateRangeOptions = {
    altInput: true,
    mode: "range",
    altInputClass:
      "form-control flat-picker bg-transparent border-0 shadow-none flatpickr-input",
    defaultDate: ["2019-05-01", "2019-05-10"],
    altFormat: "Y-n-j",
  };

  // Bar Chart
  public barChart = {
    chartType: "bar",
    datasets: [
      {
        data: [],
        backgroundColor: this.successColorShade,
        borderColor: "transparent",
        hoverBackgroundColor: this.successColorShade,
        hoverBorderColor: this.successColorShade,
      },
    ],
    labels: ["Sa", "Su", "Mo", "Tu", "We", "Th", "Fr"],
    options: {
      elements: {
        rectangle: {
          borderWidth: 2,
          borderSkipped: "bottom",
        },
      },
      responsive: true,
      maintainAspectRatio: false,
      responsiveAnimationDuration: 100,
      legend: {
        display: false,
      },
      tooltips: {
        // Updated default tooltip UI
        shadowOffsetX: 1,
        shadowOffsetY: 1,
        shadowBlur: 8,
        shadowColor: this.tooltipShadow,
        backgroundColor: colors.solid.white,
        titleFontColor: colors.solid.black,
        bodyFontColor: colors.solid.black,
      },
      scales: {
        xAxes: [
          {
            barThickness: 15,
            display: true,
            gridLines: {
              display: false,
              color: this.grid_line_color,
              zeroLineColor: this.grid_line_color,
            },
            scaleLabel: {
              display: true,
            },
            ticks: {
              fontColor: this.labelColor,
              fontSize: 13,
            },
          },
        ],
        yAxes: [
          {
            display: false,
            gridLines: {
              color: this.grid_line_color,
              zeroLineColor: this.grid_line_color,
            },
            ticks: {
              stepSize: 100000,
              min: 100,
              max: 100000,
              fontColor: this.labelColor,
            },
          },
        ],
      },
    },
    legend: false,
  };

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  public cards: any;
  public analytics: any = [];
  public user: any;
  public sellerProfile: any;
  ngOnInit() {
    this.contentHeader = {
      headerTitle: "Dashboard",
      actionButton: true,
      breadcrumb: {
        type: "",
        links: [],
      },
    };
    this.user = JSON.parse(window.localStorage.getItem("currentUser"));
    this.userService.getSellerAnalytics("sellerId=" + this.user._id).subscribe({
      next: (res: any) => {
        this.analytics = res;
        this.cards = [
          { name: "Completed Tickets", price: res["total-completed-orders"] },
          { name: "Pending Tickets", price: res["total-pending-orders"] },
          { name: "Canceled Tickets", price: res["total-cancelled-orders"] },
          { name: "Active Tickets", price: res["total-approved-orders"] },
        ];
        this.analytics["total"] =
          res["total-completed-orders"] +
          res["total-pending-orders"] +
          res["total-cancelled-orders"] +
          res["total-approved-orders"];
      },
    });
    this.userService.getSellerProfile(this.user._id).subscribe({
      next: (res: any) => {
        this.sellerProfile = res;
        this.sellerProfile.totalReview = 0;
        this.sellerProfile.totlaStarts = 0;
        this.sellerProfile.totalRating = 0;
        if (
          this.sellerProfile["reviews"] &&
          this.sellerProfile["reviews"].length > 0
        ) {
          let totalReview = 0;
          let totlaStarts = 0;
          this.sellerProfile["reviews"].forEach((item) => {
            if (item.status == 0) {
              totlaStarts += item.ratingCount;
              totalReview++;
            }
          });
          if (totalReview > 0 && totlaStarts > 0) {
            this.sellerProfile.totalRating = (
              (totlaStarts / (totalReview * 5)) *
              100
            ).toFixed(0);
          } else if (totalReview > 0 && totlaStarts <= 0) {
            this.sellerProfile.totalRating = 0;
          } else {
            this.sellerProfile.totalRating = 0;
          }
        }
      },
    });
    this.getUserCompletedOrders();
    this.getEarningAnalytics();
  }
  public completedOrders: any = [];
  getUserCompletedOrders() {
    let queryParams =
      "?userId=" +
      this.user._id +
      "&status=ACTIVE" +
      "&pageSize=10" +
      "&pageNo=1" +
      "&sortBy=updatedAt&order=desc";
    this.orderService
      .getAllCompleteSellerOrders(queryParams)
      .subscribe((res) => {
        this.completedOrders = res[0].results;
      });
  }

  public allEarningAnalytics: any = [];
  getEarningAnalytics() {
    let queryParams = "?userId=" + this.user._id;
    this.orderService.getEarningAnalytics(queryParams).subscribe((res) => {
      this.allEarningAnalytics = res;
      this.barChart["datasets"][0]["data"] = res.totalAmountWeekly;
      console.log(res);
    });
  }

  modalOpenExpoprtReport(content) {
    this.modalService.open(content, { centered: true });
  }

  exportEarningReport(exportEarnigReportForm: NgForm) {
    if (exportEarnigReportForm.valid) {
      const dateFrom = this.formatDate(
        exportEarnigReportForm.value.exportDateFrom
      );
      const dateTo = this.formatDate(exportEarnigReportForm.value.exportDateTo);

      this.http
        .get(
          `${environment.apiUrl}order/export-earnings?userId=${this.userId}&fromDate=${dateFrom}&toDate=${dateTo}`
        )
        .subscribe({
          next: (res: any) => {
            window.open(`${environment.apiUrl}${res.path}`, "_blank");
          },
        });
    } else {
      // Form is invalid, display error messages or handle accordingly
    }
  }

  formatDate(date: string): string {
    const [year, month, day] = date.split("-");
    return `${parseInt(month)}/${parseInt(day)}/${year}`;
  }

  convert(amount) {
    return this.currencyService.convert(amount);
  }
}
