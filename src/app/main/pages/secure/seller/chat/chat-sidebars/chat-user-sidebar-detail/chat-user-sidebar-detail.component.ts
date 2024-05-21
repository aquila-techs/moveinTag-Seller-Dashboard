import { Component, OnInit } from "@angular/core";

import { CoreSidebarService } from "@core/components/core-sidebar/core-sidebar.service";
import { ChatService } from "../../chat.service";
import { environment } from "environments/environment";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { UserService } from "@core/services/services/user.service";
import { Router } from "@angular/router";
import { OrderService } from "@core/services/services/order.service";

@Component({
  selector: "app-chat-user-sidebar-detail",
  templateUrl: "./chat-user-sidebar-detail.component.html",
})
export class ChatUserSidebarDetailComponent implements OnInit {
  // Public
  public activeChat: Boolean;
  public chats;
  public chatUser;
  public userProfile;
  public chatMessage = "";
  public newChat;
  public baseURL = environment.serverURL;
  public chatRoom;
  public chatUsers;
  public orderNum;
  public selectedOrder: any = [];
  private modalRef: NgbModalRef;

  /**

  /**
   * Constructor
   *
   * @param {ChatService} _chatService
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(
    private _chatService: ChatService,
    private _coreSidebarService: CoreSidebarService,
    private userService: UserService,
    private router: Router,
    private modalService: NgbModal,
    private orderService: OrderService
  ) {}

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Toggle Sidebar
   *
   * @param name
   */
  toggleSidebar(name) {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  /**
   * Update User Status
   */
  updateUserStatus() {
    this._chatService.updateUserProfile(this.userProfile);
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  searchedSeller;

  ngOnInit(): void {
    this._chatService.onSelectedChatUserChange.subscribe((res) => {
      this.chatUser = res;

      this._chatService.onSelectedChatChange.subscribe((res) => {
        this.chatUsers = res;
      });
    });
  }

  orderDetails(modalVC) {
    if (this.chatUsers) {
      const orderNum = this.chatUsers.order.orderNum;
      let queryParams = `?pageSize=10&pageNo=1&sortBy=orderNum&order=asc&orderNum=${orderNum}`;
      this.orderService
        .getAllCompleteSellerOrders(queryParams)
        .subscribe((res) => {
          this.selectedOrder = res[0].results[0];

          this.modalRef = this.modalService.open(modalVC, {
            centered: true,
            size: "lg",
          });

          this.modalRef.dismissed.subscribe((reason) => {
            if (reason !== "Cross click") {
              this.modalService.dismissAll();
            }
          });
        });
    }
  }

  getOrderDetails(modalVC) {
    this._chatService.onSelectedChatChange.subscribe((res) => {
      this.chatUsers = res;
      const orderNum = res.order.orderNum;

      let queryParams = `?pageSize=10&pageNo=1&sortBy=orderNum&order=asc&orderNum=${orderNum}`;
      this.orderService
        .getAllCompleteSellerOrders(queryParams)
        .subscribe((res) => {
          this.openOrderDetailPopup(modalVC, res.results);
        });
    });
  }

  modalOpenVC(modalVC) {
    this.modalService.open(modalVC, {
      centered: true,
      size: "lg",
    });
  }

  openOrderDetailPopup(modalVC, selectedOrders) {
    this.selectedOrder = selectedOrders;
    this.modalService.open(modalVC, {
      centered: true,
      size: "lg",
    });
  }

  openCompanyPorfile() {
    window.localStorage.setItem(
      "seller",
      JSON.stringify(this.searchedSeller[0])
    );
    this.router.navigate(["/company-detail"]);
  }
}
