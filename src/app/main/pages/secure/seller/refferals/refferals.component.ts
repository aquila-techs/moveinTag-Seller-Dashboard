import { Component, OnInit } from '@angular/core'
import { UserService } from '@core/services/services/user.service';

@Component({
  selector: 'app-refferals',
  templateUrl: './refferals.component.html',
  styleUrls: ['./refferals.component.scss']
})
export class RefferalsComponent implements OnInit {
  public userId = '';
  constructor(private userService: UserService) {
    this.userId = JSON.parse(window.localStorage.getItem('currentUser'))._id;

  }

  public contentHeader: object;

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit() {

    this.contentHeader = {
      headerTitle: 'Refferals',
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
  public sellerRefferals:any = [];
  public getSllerRefferals(){
    this.userService.getSellerRefferal(this.userId).subscribe({
      next: (res: any)=>{
        this.sellerRefferals = res[0]['results'];
      }
    })
  }
}
