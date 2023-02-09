import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '@core/services/admin-services/admin.service';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UsersListComponent implements OnInit {
  public ColumnMode = ColumnMode;
  public rows: any;
  public pageSize=10;
  public pageNo=1;
  public total=0;
  @ViewChild('tableRowDetails') tableRowDetails: any;

  constructor(private adminService: AdminService, private _router: Router) { }

  ngOnInit(): void {
    this.loadSellerWithPaginatation();
  }

  rowDetailsToggleExpand(row) {
    this.tableRowDetails.rowDetail.toggleExpandRow(row);
  }

  loadPage(event){
    this.pageNo = event;
    let queryParams = '?pageSize='+this.pageSize+'&pageNo='+event;
    this.adminService.getAllBuyer(queryParams).subscribe({
      next: (res)=>{
        this.rows = res.data;
        this.total = res.totalCount;
      },
      error: (err)=>{

      }
    })
  }

  loadSellerWithPaginatation(){
    let queryParams = '?pageSize='+this.pageSize+'&pageNo='+this.pageNo;
    this.adminService.getAllBuyer(queryParams).subscribe({
      next: (res)=>{
        this.rows = res.data;
        this.total = res.totalCount;
      },
      error: (err)=>{

      }
    })
  }

  sellerApproved(id){
    this.adminService.buyerApproved({_id: id}).subscribe({
      next: (res)=>{
        this.loadSellerWithPaginatation();
      },
      error: (err)=>{
      }
    })
  }

  sellerDisapproved(id){
    this.adminService.buyerDisapproved({_id: id}).subscribe({
      next: (res)=>{
        this.loadSellerWithPaginatation();
      },
      error: (err)=>{

      }
    })
  }

  showUserDetailPage(sellerObj){
    this.adminService.setSelectedUser(sellerObj);
    this._router.navigate(['/pages/admin/user-details/'+ sellerObj._id])
  }

  public exportApprovedBuyer(){
    this.adminService.exportApprovedBuyer().subscribe({
      next: (res)=>{
        if(res.path){
          window.open(environment.apiUrl + res.path, 'blank');
        }
      }
    })
  }

  public exportPendingVerificationBuyer(){
    this.adminService.exportPendingVerificationBuyer().subscribe({
      next: (res)=>{
        if(res.path){
          window.open(environment.apiUrl + res.path, 'blank');
        }
      }
    })
  }

}
