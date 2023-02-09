import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(private _http: HttpService) {
  }

 getAllSellersFeedback(queryParams){
   return this._http.get('feedback/seller-feedback'+queryParams)
 }

 getAllBuyerFeedback(queryParams){
  return this._http.get('feedback/buyer-feedback'+queryParams)
 }

}
