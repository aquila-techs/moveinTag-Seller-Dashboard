import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor() {}

  public contentHeader: object;
  public progressbarHeight = '.857rem';

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
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
  }
}
