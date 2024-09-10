import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { CoreConfigService } from "@core/services/config.service";
import { AdminService } from "@core/services/services/admin.service";
import { colors } from "app/colors.const";
import { AuthenticationService } from "@core/services/authentication.service";
import { ToastrService } from "ngx-toastr";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-dashboard",
  templateUrl: "./contact.component.html",
  styleUrls: ["./contact.component.scss"],
})
export class ContactComponent implements OnInit {
  public contentHeader: object;
  public pageBasicText = 3;
  category: string = "";
  description: string = "";
  public user;
  constructor(
    private authenticationService: AuthenticationService,
    private adminService: AdminService,
    private _coreConfigService: CoreConfigService,
    private toatrService: ToastrService,
    private http: HttpClient
  ) {
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
    this.authenticationService.currentUser.subscribe((x) => (this.user = x));
    this.contentHeader = {
      headerTitle: "Contact Us",
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
  }

  onSelected(event: any) {
    this.category = event.target.value;
  }

  onSubmitSendEmail() {
    if (this.category === "") {
      this.toatrService.error("Please select your category");
      return;
    }
    if (this.description === "") {
      this.toatrService.error("Please enter your description");
      return;
    }

    try {
      this.http
        .post("https://services.moventag.com/user/helpSendEmail", {
          name: this.user.companyName,
          email: this.user.email,
          category: this.category,
          description: this.description,
        })
        .subscribe({
          next: (res: any) => {
            this.toatrService.success(
              "We have recieved your email. We will get back to you ASAP!"
            );
          },
        });
    } catch (error) {
      this.toatrService.error(error);
    }
  }
}
