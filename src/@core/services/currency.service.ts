// src/app/currency.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  private currentCurrency = new BehaviorSubject<string>('cad'); // Default currency
  private conversionRates = {
    usd: 0.7210,
    cad: 1, // Example conversion rate, replace with actual API call for live rates
  };
  userId;
  constructor(private _http: HttpService) {

    if(window.localStorage.getItem("currentUser")){
      this.getDataForCurrencyConverter();
    }
  }

  getDataForCurrencyConverter(){
    this.userId = JSON.parse(window.localStorage.getItem("currentUser"))._id;
    this.getPreferedCurrency().subscribe((data)=>{
      if(data){
        this.setCurrency(data.currency);
      }
    })
    this.getExchangeRate().subscribe((data) => {
      console.log(data);
      if(data && data.conversion_rates &&  data.conversion_rates.USD){
        this.conversionRates['usd'] = data.conversion_rates.USD;
      }
    })
  }

  setCurrency(currency: string) {
    this.currentCurrency.next(currency);
    let data =  {
      'currency': currency,
      'id': this.userId
    }
    this.savePreferedCurrency(data).subscribe();
  }

  getCurrency() {
    return this.currentCurrency.asObservable();
  }

  convert(amount: number): number {
    if(!amount)return;
    const currency = this.currentCurrency.value;
    return amount * this.conversionRates[currency];
  }

  getExchangeRate() {
    return this._http.get("currency/exchange-rate");
  }


  getPreferedCurrency() {
    return this._http.get("currency/get-user-pref-currency/"+this.userId);
  }



  savePreferedCurrency(body) {
    return this._http.put("currency/update-user-pref-currency",body);
  }
}
