import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { NotificationsService } from "app/layout/components/navbar/navbar-notification/notifications.service";

@Component({
  selector: "app-navbar-notification",
  templateUrl: "./navbar-notification.component.html",
})
export class NavbarNotificationComponent implements OnInit {
  // Public
  // Public
  public notifications = [];
  public user: any;
  public unreadMessage = 0;

  /**
   *
   * @param {NotificationsService} _notificationsService
   */
  constructor(
    private _notificationsService: NotificationsService,
    private router: Router
  ) {
    this.user = JSON.parse(window.localStorage.getItem("currentUser"));
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.getAllNotification();
    this._notificationsService.connectChatRoom(this.user._id);
    this._notificationsService.getNewMessage().subscribe((message: any) => {
      if (message && message.text != "") {
        this.unreadMessage++;
        this.notifications.unshift(message);
      }
    });
  }
  getAllNotification() {
    let queryParam = "receiverId=" + this.user._id;
    this._notificationsService.getAllNotificationFromDB(queryParam).subscribe({
      next: (res: any) => {
        this.notifications = res[0].results;
        this.unreadMessage = 0;
        this.notifications.forEach((item) => {
          if (!item.viewed) {
            this.unreadMessage++;
          }
        });
      },
    });
  }

  messageRead() {
    // this.notifications = [];
    let queryParam = "receiverId=" + this.user._id;
    this._notificationsService.setNotificationRead(queryParam).subscribe({
      next: (res: any) => {
        this.getAllNotification();
      },
    });
  }

  messageHide(message) {
    let queryParam = "receiverId=" + this.user._id + "&heading=" + message;
    this._notificationsService.setNotificationHide(queryParam).subscribe({
      next: (res: any) => {
        this.getAllNotification();
      },
    });
  }
  goToMessagePage(message: any) {
    if (message.heading.toLowerCase().indexOf("message") > -1) {
      if (message?.chatRoomId) {
        window.localStorage.setItem("chatRoomId", message.chatRoomId);
      }
      this.router.navigate(["/pages/seller/chats"]);
    } else if (message.heading.toLowerCase().indexOf("lead rating") > -1) {
      this.router.navigate(["pages/seller/reviews"]);
    } else if (message.heading.toLowerCase().indexOf("quote") > -1) {
      if (message.categoryId) {
        this.router.navigate([
          "/pages/seller/quotation-listing/" + message.categoryId,
        ]);
      } else {
        this.router.navigate([
          "/pages/seller/quotation-listing/640dfae607de5a58ffdd8a25",
        ]);
      }
    } else if (message.heading.toLowerCase().indexOf("lead") > -1) {
      if (message.categoryId) {
        this.router.navigate([
          "/pages/seller/quotation-listing/" + message.categoryId,
        ]);
      } else {
        this.router.navigate([
          "/pages/seller/quotation-listing/640dfae607de5a58ffdd8a25",
        ]);
      }
    }
  }
}
