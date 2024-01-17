import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { ChatService } from '../../chat.service';
import { environment } from 'environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderService } from '@core/services/services/order.service';
import { UserService } from 'app/auth/service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from 'app/layout/components/navbar/navbar-notification/notifications.service';


@Component({
  selector: 'app-chat-sidebar',
  templateUrl: './chat-sidebar.component.html'
})
export class ChatSidebarComponent implements OnInit {
  // Public
  public contacts;
  public chatUsers;
  public searchText;
  public chats;
  public selectedIndex = null;
  public userProfile;
  public baseURL = environment.serverURL;
  /**
   * Constructor
   *
   * @param {ChatService} _chatService
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(private _chatService: ChatService, private _coreSidebarService: CoreSidebarService,
    private modalService: NgbModal,
    private orderService: OrderService,
    private userService: UserService, private activateRoute: ActivatedRoute,
    private router: Router, private notificationService: NotificationsService) {}

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Open Chat
   *
   * @param id
   * @param newChat
   */
  openChat(chatRoom) {
    this._chatService.openChat(chatRoom);
    this._chatService.getSelectedChatUser(chatRoom.user)

    // Reset unread Message to zero
    // this.chatUsers.map(user => {
    //   if (user.id === id) {
    //     user.unseenMsgs = 0;
    //   }
    // });
  }

  /**
   * Toggle Sidebar
   *
   * @param name
   */
  toggleSidebar(name) {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  /**
   * Set Index
   *
   * @param index
   */
  setIndex(index: number) {
    this.selectedIndex = index;
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe to contacts
    this._chatService.onContactsChange.subscribe(res => {
      this.contacts = res;
    });

    let skipFirst = 0;

    // Subscribe to chat users
    this._chatService.onChatUsersChange.subscribe(res => {
      this.chatUsers = res;
      if(window.localStorage.getItem('chatRoomId')){
        let chatroomIndex = this.chatUsers.findIndex(item=>{
          return item._id === window.localStorage.getItem('chatRoomId');
        })
        this.openChat(this.chatUsers[chatroomIndex]);
        this.selectedIndex = chatroomIndex;
        setTimeout(()=>{
          window.localStorage.removeItem('chatRoomId')
        },1000)
      }else{
        this.openChat(this.chatUsers[0]);
        this.selectedIndex = 0;
      }

      // Skip setIndex first time when initialized
      if (skipFirst >= 1) {
        this.setIndex(this.chatUsers.length - 1);
      }
      skipFirst++;
    });

    // Subscribe to selected Chats
    this._chatService.onSelectedChatChange.subscribe(res => {
      this.chats = res;
    });

    // Add Unseen Message To Chat User
    this._chatService.onChatsChange.pipe(first()).subscribe(chats => {
      chats.map(chat => {
        this.chatUsers.map(user => {
          if (user.id === chat.userId) {
            user.unseenMsgs = chat.unseenMsgs;
          }
        });
      });
    });

    // Subscribe to User Profile
    this._chatService.onUserProfileChange.subscribe(response => {
      this.userProfile = response;
    });
  }

  changeOrderStatus(order) {
    let currentUser = JSON.parse(window.localStorage.getItem('currentUser'))
    let userId = currentUser._id;
    let data = {
      "orderId": order._id,
      "status": 'ACTIVE',
      "sellerId": userId
    }
    if (order.buyer._id) {
      let data = {
        'heading': order.orderNum + ' Task Approved',
        'message': 'Please check tasks page for detail.',
        'receiverId': order.buyer._id,
        'senderId': userId
      }
      this.notificationService.sendMessage(data, order.buyer._id)
    }
    this.orderService.changeOrderStatus(data)
      .subscribe(res => {
        this.modalService.dismissAll();
      })
  }
}
