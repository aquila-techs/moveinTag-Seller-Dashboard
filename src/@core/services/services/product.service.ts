import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpService } from '../http.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  public selectProduct: BehaviorSubject<any>;

  constructor(private _http: HttpService) {
    this.selectProduct = new BehaviorSubject({});
   }

  setSelectedproduct(user: any){
    this.selectProduct.next(user);
  }

  getSelectedProduct(){
    return this.selectProduct.asObservable();
  }

  getAllCategories(){
    return this._http.get('category')
  }

  getAllProucts(queryParams){
    return this._http.get('product'+queryParams)
  }

  searchProduct(queryParams, data){
    return this._http.post('product/searchProduct'+queryParams,data)
  }

  addNewProdcut(data){
    return this._http.post('product',data)
  }

  updateProduct(id, data){
    return this._http.put('product/'+id,data)
  }

  getAllSellerProducts(queryParam){
    return this._http.get('sellerProduct/get-seller-products'+queryParam)
  }

  exportProducts(queryParam){
    return this._http.get('product/export-products'+queryParam)
  }

  deleteProduct(id){
    return this._http.delete('product/'+id)
  }
}
