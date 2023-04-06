import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { environment } from 'environments/environment';
import { ChatService } from '../chat.service';


@Component({
  selector: 'app-chat-content',
  templateUrl: './chat-content.component.html'
})
export class ChatContentComponent implements OnInit {
  // Decorator
  @ViewChild('scrollMe') scrollMe: ElementRef;
  scrolltop: number = null;
  messageList: any = [];

  // Public
  public activeChat: Boolean;
  public chats;
  public chatUser;
  public userProfile;
  public chatMessage = '';
  public newChat;
  public baseURL = environment.apiUrl;
  public chatRoom;
  /**
   * Constructor
   *
   * @param {ChatService} _chatService
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(private _chatService: ChatService, private _coreSidebarService: CoreSidebarService) {}

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Update Chat
   */
  sendMessage() {
    if(this.chatMessage != ""){
      this._chatService.sendMessage(this.chatMessage, this.chatRoom);
      let data = {
        'uId': this.userProfile._id,
        'message': this.chatMessage,
        'chatroomId': this.chats._id
      }
      this._chatService.sendMessageToDB(data).subscribe({
        next:(res)=>{
        }
      })
      this.newChat = {
        message: this.chatMessage,
        uId: this.userProfile._id
      };
      this.chats.chat.push(this.newChat);
      setTimeout(() => {
        this.scrolltop = this.scrollMe?.nativeElement.scrollHeight;
      }, 0);
      this.chatMessage = '';
    }
  
  }
  updateChat() {
    this.newChat = {
      message: this.chatMessage,
      userId: this.chatUser?._id
    };

    // If chat data is available (update chat)
    if (this.chats.chat) {
      if (this.newChat.message !== '') {
        this.chats.chat.push(this.newChat);
        this._chatService.updateChat(this.chats);
        this.chatMessage = '';
        setTimeout(() => {
          this.scrolltop = this.scrollMe?.nativeElement.scrollHeight;
        }, 0);
      }
    }
    // Else create new chat
    else {
      this._chatService.createNewChat(this.chatUser.id, this.newChat);
    }
  }

  /**
   * Toggle Sidebar
   *
   * @param name
   */
  toggleSidebar(name) {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // this._chatService.connectChatRoom();
    // Subscribe to Chat Change
    this._chatService.onChatOpenChange.subscribe(res => {
      this.chatMessage = '';
      this.activeChat = res;
      setTimeout(() => {
        this.scrolltop = this.scrollMe?.nativeElement.scrollHeight;
      }, 0);
    });

    // Subscribe to Selected Chat Change
    this._chatService.onSelectedChatChange.subscribe(res => {
      this.chats = res;
      if(this.chatRoom){
        this._chatService.LeaveChatRoom(this.chatRoom);
      }
      this.chatRoom = this.chats.chatroom;
      this._chatService.connectChatRoom(this.chatRoom);
      setTimeout(() => {
        this.scrolltop = this.scrollMe?.nativeElement.scrollHeight;
      }, 0);
    });

    // Subscribe to Selected Chat User Change
    this._chatService.onSelectedChatUserChange.subscribe(res => {
      this.chatUser = res;
    });
    this.userProfile = this._chatService.userProfile;
    this._chatService.getNewMessage().subscribe((message: string) => {
      this.newChat = {
        message: message,
        uId: this.chatUser?._id
      };
      if(this.chats['chat']){
        this.chats.chat.push(this.newChat);
      }
      setTimeout(() => {
        this.scrolltop = this.scrollMe?.nativeElement.scrollHeight;
      }, 0);
    })
  }
}
