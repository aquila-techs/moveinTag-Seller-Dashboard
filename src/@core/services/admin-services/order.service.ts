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

  getAllSellerOrders(queryParams){
    return this._http.get('order/get-seller-all-order'+queryParams)
  }

  getAllBuyerOrders(queryParams){
    return this._http.get('order/get-user-all-order'+queryParams)
  }

  changeOrderStatus(data){
    return this._http.put('order/update-status-order',data)
  }

  exportOrders(){
    return this._http.get('order/export-orders')
  }

}
