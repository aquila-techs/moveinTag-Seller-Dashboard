import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpService } from '../http.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  public selectOrder: BehaviorSubject<any>;

  constructor(private _http: HttpService) {
    this.selectOrder = new BehaviorSubject({});
   }

  setSelectedOrder(user: any){
    this.selectOrder.next(user);
  }

  getSelectedProduct(){
    return this.selectOrder.asObservable();
  }

  getAllOrders(){
    return this._http.get('order/get-all-orders')
  }

  getAllCompleteSellerOrders(queryParams){
    return this._http.get('order/get-all-orders'+queryParams)
  }
  getEarningAnalytics(queryParams){
    return this._http.get('order/get-all-earning-analytics'+queryParams)
  }

  getAllQuotesOrders(queryParams){
    return this._http.get('order/get-all-orders'+queryParams)
  }

  getAllActiveSellerOrders(queryParams){
    return this._http.get('order/get-all-orders'+queryParams)
  }
  getAllUserEarningOrders(queryParams){
    return this._http.get('order/get-all-earning'+queryParams)
  }

  getAllCancelledSellerOrders(queryParams){
    return this._http.get('order/get-all-orders'+queryParams)
  }

  getAllBuyerOrders(queryParams){
    return this._http.get('order/get-user-all-order'+queryParams)
  }

  changeOrderStatus(data){
    return this._http.put('order/update-status-order',data)
  }

  changeOrderStatusFromChat(data){
    return this._http.put('order/update-status-order-from-chat',data)
  }

  exportOrders(){
    return this._http.get('order/export-orders')
  }

  getAllReviews(queryParams){
    return this._http.get('reviews'+queryParams)

  }

}
