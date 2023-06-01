import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CoreMenuService } from '@core/components/core-menu/core-menu.service';
import { UserService } from '@core/services/services/user.service';

@Component({
  selector: '[core-menu]',
  templateUrl: './core-menu.component.html',
  styleUrls: ['./core-menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoreMenuComponent implements OnInit {
  currentUser: any;

  @Input()
  layout = 'vertical';

  @Input()
  menu: any;

  sidebar:any;
  filterCategories: any= [];
  // Private
  private _unsubscribeAll: Subject<any>;
  public userId = '';

  /**
   *
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @param {CoreMenuService} _coreMenuService
   */
  constructor(private _changeDetectorRef: ChangeDetectorRef, 
    private _coreMenuService: CoreMenuService, private userService: UserService) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  // Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.userId = JSON.parse(window.localStorage.getItem('currentUser'))._id;

   
    
    // Subscribe to the current menu changes
    this._coreMenuService.onMenuChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
      this.currentUser = this._coreMenuService.currentUser;

      // Load menu
      this.sidebar = this._coreMenuService.getCurrentMenu();

      this._changeDetectorRef.markForCheck();
    });
     // Set the menu either from the input or from the service
     this.userService.getSellerCategoriesOnly(this.userId).subscribe({
      next: (res: any)=>{
        if(!res){
          this.sidebar = this.sidebar || this._coreMenuService.getCurrentMenu();
          console.log(this.menu);
        }else{
          this.sidebar = this.sidebar || this._coreMenuService.getCurrentMenu();
          console.log(this.sidebar);
          if(res[0].results.length > 0){
            this.filterCategories = [];
            res[0].results.forEach((element)=>{
              if(this.filterCategories.length <= 0){
                let itemData = {
                  id: 'home-services',
                  icon: '',
                  title: element.category.title,
                  type: 'item',
                  url: 'pages/seller/quotation-listing/'+element.category._id
                };
                this.sidebar[2].children.push(itemData);
                this.filterCategories.push(element.category);
              }else{
                let matchAdded = false;
                this.filterCategories.forEach(item =>{
                  if(item._id === element.category._id){
                    matchAdded = true;
                  }
                })
                if(!matchAdded){
                  let itemData = {
                    id: 'home-services',
                    icon: '',
                    title: element.category.title,
                    type: 'item',
                    url: 'pages/seller/quotation-listing/'+element.category._id
                  };
                  this.sidebar[2].children.push(itemData);
                  this.filterCategories.push(element.category);
                }
              }
              
            })
          }
          this.menu = this.sidebar;
          this._changeDetectorRef.markForCheck();
        }

      }

    });
    
  }
}
