import { Component, OnInit } from "@angular/core";
import { CoreConfigService } from "@core/services/config.service";

@Component({
  selector: "app-privacyPolicy",
  templateUrl: "./privacyPolicy.component.html",
  styleUrls: ["./privacyPolicy.component.scss"],
})
export class PrivacyPolicyComponent implements OnInit {
  public radioModel = 1;
  public checkboxModel = {
    left: true,
    middle: false,
    right: false,
  };

  public hasBaseDropZoneOver: boolean = false;

  constructor(private _coreConfigService: CoreConfigService) {
    // Configure the layout
    this._coreConfigService.config = {
      layout: {
        navbar: {
          hidden: true,
          background: "",
          customBackgroundColor: true,
          backgroundColor: "position-static",
        },
        menu: {
          hidden: true,
        },
        footer: {
          hidden: false,
          background: "",
        },
      },
    };
  }

  public contentHeader: object;

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  public show = false;

  /**
   * On init
   */
  ngOnInit() {
    this.contentHeader = {
      headerTitle: "Home",
      actionButton: false,
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
    };
  }
}
