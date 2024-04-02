import { Component, OnInit } from "@angular/core";

import { CoreSidebarService } from "@core/components/core-sidebar/core-sidebar.service";
import { ChatService } from "../../chat.service";
import { environment } from "environments/environment";
import { UserService } from "@core/services/services/user.service";
import { Router } from "@angular/router";

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
    private router: Router
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
      console.log("===============");
      console.log(res);
      console.log("===============");
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
