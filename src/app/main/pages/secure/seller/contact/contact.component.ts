import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CoreConfigService } from '@core/services/config.service';
import { AdminService } from '@core/services/services/admin.service';
import { colors } from 'app/colors.const';

@Component({
  selector: 'app-dashboard',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  public contentHeader: object;
  public pageBasicText = 3;
  constructor(private adminService: AdminService, private _coreConfigService: CoreConfigService) {
  
    // this._coreConfigService.config = {
    //   layout: {
    //     navbar: {
    //       hidden: true,
    //       showNavbarDashboard: true
    //     },
    //     menu: {
    //       hidden: false
    //     },
    //     footer: {
    //       hidden: true,
    //     },
    //   }
    // };
  }
  /**
   * On init
   */
  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'Contact Us',
      actionButton: false,
      breadcrumb: {
        type: '',
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
        ]
      }
    };
  }
}
