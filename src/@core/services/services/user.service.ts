import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpService } from '../http.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
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
    return this._http.get('user/seller/'+id)
  }

  updateProfile(body){
    return this._http.put('user/update', body)
  }

  createUserZipCodes(data){
    return this._http.post('user/save-seller-zipcodes',data)
  }

  getUserZipCodes(data){
    return this._http.post('user/get-seller-zipcodes',data)
  }

  addUserSerivesPhotos(data){
    return this._http.post('user/add-seller-service-photo',data)
  }

  saveSellerCategories(data){
    return this._http.post('seller-category/create-seller-categories',data)
  }

  getNearByPostalCode(queryParam){
    return this._http.get('seller-category/get-nearby-zipcode'+queryParam)

  }

  getUserSerivesPhotos(id){
    return this._http.get('user/seller-images/'+id)
  }

  deleteUserSerivesPhoto(id){
    return this._http.delete('user/seller-image/'+id)
  }

  updateCoverPhoto(body){
    return this._http.put('user/update-cover-photo', body)
  }
  updateSellerLicense(body){
    return this._http.put('user/update-seller-license', body)
  }
  updateSellerLibilityInsurance(body){
    return this._http.put('user/update-seller-libilityInsurance', body)
  }
  updateSellerIdentityCard(body){
    return this._http.put('user/update-seller-IdentityCard', body)
  }
  getSellerProfile(id){
    return this._http.get('user/seller/'+id)
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

  getSellerRefferal(id){
    return this._http.get('user/seller--refferal/'+id)
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
  getACategory(id){
    return this._http.get('category/'+id);
  }

  getAllCategoriesWithSubCategories(){
    return this._http.get('category/getAllCategoryWithMidLevelAndSubCategory');
  }

  getSellerCategoriesWithSubCategories(id){
    return this._http.get('seller-category/get-seller-categories?userId='+id);
  }
  
  getSellerCategoriesOnly(id){
    return this._http.get('seller-category/get-seller-categories-only?userId='+id);
  }

  getAnalytics(){
    return this._http.get('admin/get-analytics');
  }

  createChatRoom(body){
    return this._http.post('chat/createChatRoom',body);
  }
  createStripeToken(body){
    return this._http.post('payment/create-token',body);
  }
  createSubscriptionCustomer(body){
    return this._http.post('payment/createSubscriptionCustomer',body);
  }
  getSubscriptionCustomerInfo(body){
    return this._http.post('payment/subscription-info',body);
  }
  getCustomerCardDetailInfo(body){
    return this._http.post('payment/get-all-card-list',body);
  }
  getCustomerPaymentMethodDetailInfo(body){
    return this._http.post('payment/get-all-payment-method-list',body);
  }
  setPaymentMethodAsDefault(body){
    return this._http.post('payment/set-default-payment-method',body);
  }
  getSubsciptionList(body){
    return this._http.post('payment/subscription-info',body);
  }
  addNewCard(body){
    return this._http.post('payment/add-new-card',body);
  }
  deleteCard(body){
    return this._http.post('payment/delete-card',body);
  }
  cancelSubscriptionCustomer(body){
    return this._http.post('payment/cancel-subscription',body);
  }
  reactivateSubscriptionCustomer(body){
    return this._http.post('payment/reactivate-subscription',body);
  }
  pauseSubscriptionCustomer(body){
    return this._http.post('payment/pause-subscription',body);
  }
  activeSubscriptionCustomer(body){
    return this._http.post('payment/resume-subscription',body);
  }

  getSellerAnalytics(queryParam){
    return this._http.get('user/get-seller-analytics?'+queryParam);

  }

  getSellerActiveSubacription(body){
    return this._http.post('payment/check-user-active-subscription',body);

  }

  
  reactiveSubacription(body){
    return this._http.post('payment/reactive-subscription',body);

  }

  affMakePurchase(body) {
    return this._http.post('user/force-purchase', body);
  }

  

}
