import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { HttpService } from '@core/services/http.service';
import { environment } from 'environments/environment';

import { BehaviorSubject, Observable } from 'rxjs';
import { io } from "socket.io-client";


@Injectable()
export class ChatService {
  public contacts: any[];
  public chats: any[];
  public userProfile;
  public isChatOpen: Boolean;
  public chatUsers: any[];
  public selectedChat;
  public selectedChatUser;
  public userId;
  public onContactsChange: BehaviorSubject<any>;
  public onChatsChange: BehaviorSubject<any>;
  public onSelectedChatChange: BehaviorSubject<any>;
  public onSelectedChatUserChange: BehaviorSubject<any>;
  public onChatUsersChange: BehaviorSubject<any>;
  public onChatOpenChange: BehaviorSubject<Boolean>;
  public onUserProfileChange: BehaviorSubject<any>;

  constructor(private _httpClient: HttpClient,private _http: HttpService) {
    this.userId = JSON.parse(window.localStorage.getItem('currentUser'))._id;
    this.isChatOpen = false;
    this.onContactsChange = new BehaviorSubject([]);
    this.onChatsChange = new BehaviorSubject([]);
    this.onSelectedChatChange = new BehaviorSubject([]);
    this.onSelectedChatUserChange = new BehaviorSubject([]);
    this.onChatUsersChange = new BehaviorSubject([]);
    this.onChatOpenChange = new BehaviorSubject(false);
    this.onUserProfileChange = new BehaviorSubject([]);
  }

  /**
   * Resolver
   *
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<any> | Promise<any> | any}
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise<void>((resolve, reject) => {
      Promise.all([
        // this.getContacts(),
        // this.getChats(),
        this.getUserProfile(),
        // this.getActiveChats(),
        // this.getChatUsers(),
        this.getAllChatsRoom(this.userId)
      ]).then(() => {
        resolve();
      }, reject);
    });
  }

  /**
   * Get Contacts
   */
  getContacts(): Promise<any[]> {
    return new Promise((resolve, reject) => {
        this.contacts = [
          {
            id: 1,
            fullName: 'Felecia Rower',
            role: 'Frontend Developer',
            about: 'Cake pie jelly jelly beans. Marzipan lemon drops halvah cake. Pudding cookie lemon drops icing',
            avatar: 'assets/images/avatars/1.png',
            status: 'offline'
          },
          {
            id: 2,
            fullName: 'Adalberto Granzin',
            role: 'UI/UX Designer',
            about:
              'Toffee caramels jelly-o tart gummi bears cake I love ice cream lollipop. Sweet liquorice croissant candy danish dessert icing. Cake macaroon gingerbread toffee sweet.',
            avatar: 'assets/images/avatars/2.png',
            status: 'busy'
          },
          {
            id: 3,
            fullName: 'Joaquina Weisenborn',
            role: 'Town planner',
            about:
              'Soufflé soufflé caramels sweet roll. Jelly lollipop sesame snaps bear claw jelly beans sugar plum sugar plum.',
            avatar: 'assets/images/avatars/3.png',
            status: 'busy'
          }]; 
        resolve(this.contacts);
    });
  }

  /**
   * Get Chats
   */
  getChats(): Promise<any[]> {

    return new Promise((resolve, reject) => {
    this.chats = [
      {
        id: 1,
        userId: 2,
        unseenMsgs: 1,
        chat: [
         
          {
            message: 'I will inform you as I get update on this.',
            time: 'Mon Dec 11 2018 07:46:15 GMT+0000 (GMT)',
            senderId: 2
          },
          {
            message: 'If it takes long you can mail me at my mail address.',
            time: 'dayBeforePreviousDay',
            senderId: 11
          }
        ]
      },
      {
        id: 2,
        userId: 1,
        unseenMsgs: 0,
        chat: [
          {
            message: 'Thanks, from ThemeForest.',
            time: 'Mon Dec 10 2018 07:46:53 GMT+0000 (GMT)',
            senderId: 11
          },
          {
            message: 'I will purchase it for sure. 👍',
            time: 'previousDay',
            senderId: 1
          }
        ]
      }
    ];
    this.onChatsChange.next(this.chats);
    resolve(this.chats);
    });
  }

  /**
   * Get User Profile
   */
  getUserProfile(): Promise<any[]> {

    return new Promise((resolve, reject) => {
      this.userProfile = JSON.parse(window.localStorage.getItem('currentUser'));
      this.onUserProfileChange.next(this.userProfile);
      
      resolve(this.userProfile);
    });
  }

  /**
   * Get Selected Chat User
   *
   * @param userId
   */
  getSelectedChatUser(user) {
    this.selectedChatUser = user;
    this.onSelectedChatUserChange.next(this.selectedChatUser);
  }

  /**
   * Get Active Chats
   */
  getActiveChats() {
    // const chatArr = this.chats.filter(chat => {
    //   return this.contacts.some(contact => {
    //     return contact.id === chat.userId;
    //   });
    // });
    const chatArr = [
      {
        id: 1,
        userId: 2,
        unseenMsgs: 1,
        chat: [
          {
            message: 'Hi',
            time: 'Mon Dec 10 2018 07:45:00 GMT+0000 (GMT)',
            senderId: 11
          },
          {
            message: 'Hello. How can I help You?',
            time: 'Mon Dec 11 2018 07:45:15 GMT+0000 (GMT)',
            senderId: 2
          },
          {
            message: 'Can I get details of my last transaction I made last month?',
            time: 'Mon Dec 11 2018 07:46:10 GMT+0000 (GMT)',
            senderId: 11
          },
          {
            message: 'We need to check if we can provide you such information.',
            time: 'Mon Dec 11 2018 07:45:15 GMT+0000 (GMT)',
            senderId: 2
          },
          {
            message: 'I will inform you as I get update on this.',
            time: 'Mon Dec 11 2018 07:46:15 GMT+0000 (GMT)',
            senderId: 2
          },
          {
            message: 'If it takes long you can mail me at my mail address.',
            time: 'dayBeforePreviousDay',
            senderId: 11
          }
        ]
      }
    ]
  }

  /**
   * Get Chat Users
   */
  getChatUsers() {
    // const contactArr = this.contacts.filter(contact => {
    //   return this.chats.some(chat => {
    //     return chat.userId === contact.id;
    //   });
    // });
    const contactArr = [
      {
        id: 1,
        fullName: 'Felecia Rower',
        role: 'Frontend Developer',
        about: 'Cake pie jelly jelly beans. Marzipan lemon drops halvah cake. Pudding cookie lemon drops icing',
        avatar: 'assets/images/avatars/1.png',
        status: 'offline'
      },
      {
        id: 2,
        fullName: 'Adalberto Granzin',
        role: 'UI/UX Designer',
        about:
          'Toffee caramels jelly-o tart gummi bears cake I love ice cream lollipop. Sweet liquorice croissant candy danish dessert icing. Cake macaroon gingerbread toffee sweet.',
        avatar: 'assets/images/avatars/2.png',
        status: 'busy'
      }];
    this.chatUsers = contactArr;
    this.onChatUsersChange.next(this.chatUsers);
  }

  /**
   * Selected Chats
   *
   * @param id
   */
  selectedChats(chatRoom) {
    // const selectChat = this.chats.find(chat => chat.userId === id);

    // If Chat is Avaiable of Selected Id
    // if (selectChat !== undefined) {
    //   this.selectedChat = selectChat;

    //   this.onSelectedChatChange.next(this.selectedChat);
    //   this.getSelectedChatUser(id);
    // }
    // Else Create New Chat
    // else {
    //   const newChat = {
    //     userId: id,
    //     unseenMsgs: 0
    //   };
    //   this.onSelectedChatChange.next(newChat);
    //   this.getSelectedChatUser(id);
    // }

    this._http.get('chat/getChatMessages?chatroomId='+chatRoom._id).subscribe((res) => {
      
      let chatRoomObj =  chatRoom;
      chatRoomObj['chat'] = res;
      this.selectedChat = chatRoomObj
      this.onSelectedChatChange.next(this.selectedChat);
      // this.getSelectedChatUser(id);
    });
  }

  /**
   * Create New Chat
   *
   * @param id
   * @param chat
   */
  createNewChat(id, chat) {
    const newChat = {
      userId: id,
      unseenMsgs: 0,
      chat: [chat]
    };

    if (chat.message !== '') {
      return new Promise<void>((resolve, reject) => {
        this._httpClient.post('api/chat-chats/', { ...newChat }).subscribe(() => {
          this.getChats();
          this.getChatUsers();
          this.getSelectedChatUser(id);
          this.openChat(id);
          resolve();
        }, reject);
      });
    }
  }

  /**
   * Open Chat
   *
   * @param id
   */
  openChat(chatRoom) {
    this.isChatOpen = true;
    this.onChatOpenChange.next(this.isChatOpen);
    this.selectedChats(chatRoom);
  }

  /**
   * Update Chat
   *
   * @param chats
   */
  updateChat(chats) {
    return new Promise<void>((resolve, reject) => {
      this._httpClient.post('api/chat-chats/' + chats.id, { ...chats }).subscribe(() => {
        this.getChats();
        resolve();
      }, reject);
    });
  }

  /**
   * Update User Profile
   *
   * @param userProfileRef
   */
  updateUserProfile(userProfileRef) {
    this.userProfile = userProfileRef;
    this.onUserProfileChange.next(this.userProfile);
  }


  
  public message$: BehaviorSubject<string> = new BehaviorSubject('');

  socket = io(environment.socketURL);

  public sendMessage(message: any, roomName: any) {
    // this.socket.emit('message', {message,roomName});
    if (this.socket) this.socket.emit('message', { message, roomName });
  }

  public getNewMessage = () => {
    this.socket.off('message').on('message', (message) =>{
      if(message != ''){
        this.message$.next(message);
      }
    });
    
    return this.message$.asObservable();
  };

  public connectChatRoom(chatRoom) {
    if(!chatRoom){
      return;
    }
    // this.socket.emit('message', {message,roomName});
    if (this.socket) this.socket.emit('joinRoom', chatRoom);
  }

  public LeaveChatRoom(chatRoom) {
    if(!chatRoom){
      return;
    }
    // this.socket.emit('message', {message,roomName});
    if (this.socket) this.socket.emit('leaveRoom', chatRoom);
  }

  public getAllChatsRoom(id){
    return new Promise<void>((resolve, reject) => {
      this._http.get('chat/getChatRooms?sellerId='+id).subscribe((res) => {
        this.chatUsers = res[0].results;
        this.onChatUsersChange.next(this.chatUsers);
        resolve();
      }, reject);
    });
  }


  sendMessageToDB(body){
    return this._http.post('chat/sendMessage', body);
  }

  
  createChatRoom(body){
    return this._http.post('chat/createChatRoom',body);
  }
}
