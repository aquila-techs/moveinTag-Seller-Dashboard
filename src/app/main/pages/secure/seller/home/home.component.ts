import { Component, OnInit } from '@angular/core'
import { UserService } from '@core/services/services/user.service';
import { colors } from 'app/colors.const';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private userService: UserService) { }

  public contentHeader: object;
  public progressbarHeight = '.857rem';
  public radioModel = 1;

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

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  public cards: any;
  public analytics: any;
  public user: any;
  ngOnInit() {

    this.contentHeader = {
      headerTitle: 'Dashboard',
      actionButton: true,
      breadcrumb: {
        type: '',
        links: [
        ]
      }
    }
    this.user = JSON.parse(window.localStorage.getItem('currentUser'));
    this.userService.getSellerAnalytics("sellerId=" + this.user._id).subscribe({
      next: (res: any) => {
        this.analytics = res;
        this.cards = [
          { name: 'Completed Tickets', price: res['total-completed-orders'] },
          { name: 'Pending Tickets', price: res['total-pending-orders'] },
          { name: 'Canceled Tickets', price: res['total-cancelled-orders'] },
          { name: 'Active Tickets', price: res['total-approved-orders'] },
        ];
        this.analytics['total'] = res['total-completed-orders'] +
          res['total-pending-orders'] + res['total-cancelled-orders'] + res['total-approved-orders'];

      }
    })
  }


}
