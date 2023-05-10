import { Component, OnInit } from '@angular/core';

import { NotificationsService } from 'app/layout/components/navbar/navbar-notification/notifications.service';


@Component({
  selector: 'app-navbar-notification',
  templateUrl: './navbar-notification.component.html'
})
export class NavbarNotificationComponent implements OnInit {
  // Public
   // Public
   public notifications= [];
   public user: any;

  /**
   *
   * @param {NotificationsService} _notificationsService
   */
  constructor(private _notificationsService: NotificationsService) {
    this.user = JSON.parse(window.localStorage.getItem('currentUser'));

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
     if(message && message.text != ""){
       this.notifications.push(message);
     }
    })
  }
  getAllNotification(){
   let queryParam = 'receiverId='+ this.user._id
   this._notificationsService.getAllNotificationFromDB(queryParam).subscribe({
     next: (res: any)=>{
       this.notifications = res[0].results;
     }
   })
  }
 
  messageRead(){
    this.notifications = [];
   let queryParam = 'receiverId='+ this.user._id
   this._notificationsService.setNotificationRead(queryParam).subscribe({
     next: (res: any)=>{
      //  this.notifications = res;
     }
   })
  }
}
