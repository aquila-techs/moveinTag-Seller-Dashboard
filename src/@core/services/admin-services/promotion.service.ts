import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {


  constructor(private _http: HttpService) {
   }

  getAllPromotions(queryParams){
    return this._http.get('promotion'+queryParams)
  }

  getPromotion(id){
    return this._http.get('promotion/'+id)
  }

  addNewPromotion(data){
    return this._http.post('promotion',data)
  }

  updatePromotion(id, data){
    return this._http.put('promotion/'+id,data)
  }

  deletePromotion(id){
    return this._http.delete('promotion/'+id)
  }

}
