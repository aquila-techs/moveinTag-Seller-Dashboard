import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

import { BehaviorSubject } from 'rxjs';
import { io } from "socket.io-client";

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  // Public
  public apiData = [];
  public onApiDataChange: BehaviorSubject<any>;
  public baseURL = environment.apiUrl;
  /**
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {
    this.onApiDataChange = new BehaviorSubject('');
    // this.getNotificationsData();
  }

  /**
   * Get Notifications Data
   */
  getNotificationsData(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.get('api/notifications-data').subscribe((response: any) => {
        this.apiData = response;
        this.onApiDataChange.next(this.apiData);
        resolve(this.apiData);
      }, reject);
    });
  }
  public message$: BehaviorSubject<string> = new BehaviorSubject('');

  socket = io(environment.socketURL+"/notification");

  public sendMessage(message: any, roomName: any) {
    console.log(message);
    this.createNotification(message).subscribe({
      next: (res)=>{
        if (this.socket) this.socket.emit('message', { message, roomName });
      }
    });
    // this.socket.emit('message', {message,roomName});
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
    window.localStorage.setItem('chatRoom',chatRoom );
    // this.socket.emit('message', {message,roomName});
    if (this.socket) this.socket.emit('joinRoom', chatRoom);
  }

  public LeaveChatRoom(chatRoom) {
    if(!chatRoom){
      return;
    }
    // window.localStorage.removeItem('chatRoom');
    // this.socket.emit('message', {message,roomName});
    if (this.socket) this.socket.emit('leaveRoom', chatRoom);
  }

  public getAllNotificationFromDB(queryParam){
    return this._httpClient.get(this.baseURL+'notification/getNotification?'+queryParam)
  }

  public setNotificationRead(queryParam){
    return this._httpClient.get(this.baseURL+'notification/readNoification?'+queryParam)
  }

  public createNotification(body){
    return this._httpClient.post(this.baseURL+'notification/createNotifiation',body)
  }
  public setNotificationHide(queryParam){
    return this._httpClient.get(this.baseURL+'notification/hideNoification?'+queryParam)
  }
  
}
