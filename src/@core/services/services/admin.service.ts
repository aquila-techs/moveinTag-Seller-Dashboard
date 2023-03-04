import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpService } from '../http.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  public selectedUser: BehaviorSubject<any>;

  constructor(private _http: HttpService) {
    this.selectedUser = new BehaviorSubject({});
   }

  setSelectedUser(user: any){
    this.selectedUser.next(user);
  }

  getSelectedUser(){
    return this.selectedUser.asObservable();
  }

  createSeller(data){
    return this._http.post('user/seller-sign-up',data)
  }

  getProfile(id){
    return this._http.get('user/me/'+id)
  }

  getAllSeller(queryParams){
    return this._http.post('admin/get-all-seller'+queryParams,{})
  }

  getAllBuyer(queryParams){
    return this._http.post('admin/get-all-buyers'+queryParams,{})
  }
 

  getAllPendingApprovalSeller(queryParams){
    return this._http.post('admin/get-all-pending-approval-seller'+queryParams,{})
  }

  buyerApproved(id){
    return this._http.post('admin/buyer-approved',id)
  }

  buyerDisapproved(id){
    return this._http.post('admin/buyer-disapproved',id)
  }

  sellerApproved(id){
    return this._http.post('admin/seller-approved',id)
  }

  sellerDisapproved(id){
    return this._http.post('admin/seller-disapproved',id)
  }

  sellerDocApproved(id){
    return this._http.post('admin/seller-doc-approved',id)
  }

  sellerDocDisapproved(id){
    return this._http.post('admin/seller-doc-disapproved',id)
  }

  forgotPassword(body){
    return this._http.post('user/forget-password', body);
  }

  resetPassword(body){
    return this._http.post('user/reset-password', body);
  }
  verifyEmail(id){
    return this._http.get('user/verify-email/'+id);
  }

  exportApprovedSeller(){
    return this._http.get('user/export-approved-seller');
  }
  exportRejectedSeller(){
    return this._http.get('user/export-rejected-seller');
  }
  exportPendingApprovalSeller(){
    return this._http.get('user/export-pending-approval-seller');
  }

  exportApprovedBuyer(){
    return this._http.get('user/export-approved-buyer');
  }

  exportPendingVerificationBuyer(){
    return this._http.get('user/export-pending-verification-buyer');
  }
  
  getAllCategories(){
    return this._http.get('category/');
  }

  getAnalytics(){
    return this._http.get('admin/get-analytics');
  }
  
}
