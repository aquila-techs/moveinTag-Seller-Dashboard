import { Component, OnInit } from '@angular/core'
import { OrderService } from '@core/services/services/order.service';
import { colors } from 'app/colors.const';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-earnings',
  templateUrl: './earnings.component.html',
  styleUrls: ['./earnings.component.scss']
})
export class EarningsComponent implements OnInit {

  constructor(private orderService: OrderService, private http: HttpClient) {
    this.userId = JSON.parse(window.localStorage.getItem('currentUser'))._id;
  }

  public contentHeader: object;
  public radioModel = 1;
  searchText: string = "";

  // Color Variables
  private successColorShade = 'rgba(115, 103, 240, 0.85)';
  private tooltipShadow = 'rgba(0, 0, 0, 0.25)';
  private labelColor = '#6e6b7b';
  private grid_line_color = 'rgba(200, 200, 200, 0.2)'; // RGBA color helps in dark layout

  // ng2-flatpickr options
  public DateRangeOptions = {
    altInput: true,
    mode: 'range',
    altInputClass: 'form-control flat-picker bg-transparent border-0 shadow-none flatpickr-input',
    defaultDate: ['2019-05-01', '2019-05-10'],
    altFormat: 'Y-n-j'
  };

  // Bar Chart
  public barChart = {
    chartType: 'bar',
    datasets: [
      {
        data: [275, 90, 190, 205, 125, 85, 55, 87, 127, 150, 230, 280, 190],
        backgroundColor: this.successColorShade,
        borderColor: 'transparent',
        hoverBackgroundColor: this.successColorShade,
        hoverBorderColor: this.successColorShade
      }
    ],
    labels: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
    options: {
      elements: {
        rectangle: {
          borderWidth: 2,
          borderSkipped: 'bottom',
        }
      },
      responsive: true,
      maintainAspectRatio: false,
      responsiveAnimationDuration: 500,
      legend: {
        display: false
      },
      tooltips: {
        // Updated default tooltip UI
        shadowOffsetX: 1,
        shadowOffsetY: 1,
        shadowBlur: 8,
        shadowColor: this.tooltipShadow,
        backgroundColor: colors.solid.white,
        titleFontColor: colors.solid.black,
        bodyFontColor: colors.solid.black
      },
      scales: {
        xAxes: [
          {
            barThickness: 25,
            display: true,
            gridLines: {
              display: false,
              color: this.grid_line_color,
              zeroLineColor: this.grid_line_color
            },
            scaleLabel: {
              display: true
            },
            ticks: {
              fontColor: this.labelColor,
              fontSize: 13

            }
          }
        ],
        yAxes: [
          {
            display: false,
            gridLines: {
              color: this.grid_line_color,
              zeroLineColor: this.grid_line_color
            },
            ticks: {
              stepSize: 100,
              min: 0,
              max: 400,
              fontColor: this.labelColor
            }
          }
        ]
      }
    },
    legend: false
  };

  onSubmitSearch() {
    const Text = this.searchText;
    this.http.post("https://api.moventag.com/order/searchSellerEarning", {
      orderNum: Text
    }).subscribe({
      next: (res: any) => {
        if (res.length < 1) {
          this.earningOrders = [];
          return;
        }
        this.earningTotal = res.length;
        this.earningOrders = [res];
      }
    })
  }

  onSubmitClear() {
    this.getUserEatnings();
  }


  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit() {

    this.contentHeader = {
      headerTitle: 'Earnings',
      actionButton: true,
      headerRight: false,
      // breadcrumb: {
      //   type: '',
      //   links: [
      //     {
      //       name: 'Home',
      //       isLink: true,
      //       link: '/'
      //     },
      //     {
      //       name: 'Sample',
      //       isLink: false
      //     }
      //   ]
      // }
    }

    this.getUserEatnings();
  }
  public earningTotal = 0;
  public earningOrders = [];
  public earningPage = 1;
  public pageSize = 10;
  public userId = '';

  getUserEatnings() {
    let queryParams = '?userId=' + this.userId + '&pageSize=' + this.pageSize + '&pageNo=' + this.earningPage + '&sortBy=createdAt&order=desc';
    this.orderService.getAllUserEarningOrders(queryParams)
      .subscribe(res => {
        this.earningTotal = res[0]['count'][0].totalCount;
        this.earningOrders = res[0].results;
      })
  }

  loadEarningdPage(event) {
    this.earningPage = event;
    this.getUserEatnings();
  }
}
