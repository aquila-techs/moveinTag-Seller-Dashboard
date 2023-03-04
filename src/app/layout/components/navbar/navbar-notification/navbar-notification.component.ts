import { Component, OnInit } from '@angular/core';

import { NotificationsService } from 'app/layout/components/navbar/navbar-notification/notifications.service';

// Interface
interface notification {
  messages: [
    {
      image: '',
      heading: 'Title',
      text: 'You have got a quote request from customer xyz'
    },
    {
      image: '',
      heading: 'Title',
      text: 'You have got a quote request from customer xyz'
    }
  ];
  systemMessages: [];
  system: Boolean;
}

@Component({
  selector: 'app-navbar-notification',
  templateUrl: './navbar-notification.component.html'
})
export class NavbarNotificationComponent implements OnInit {
  // Public
  public notifications: notification;

  /**
   *
   * @param {NotificationsService} _notificationsService
   */
  constructor(private _notificationsService: NotificationsService) {}

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this._notificationsService.onApiDataChange.subscribe(res => {
      this.notifications = res;
    });
  }
}
