import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'app-earnings',
  templateUrl: './earnings.component.html',
  styleUrls: ['./earnings.component.scss']
})
export class EarningsComponent implements OnInit {

  constructor() {}

  public contentHeader: object;

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
  }
}
