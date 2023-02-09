import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private BASE_URL: string = environment.apiUrl;
  constructor(private httpClient: HttpClient) { }

  public get(url: string): Observable<any>{
    return this.httpClient.get(this.BASE_URL+ url);
  }

  public post(url: string ,body?: any ): Observable<any>{
    return this.httpClient.post(this.BASE_URL+ url, body);
  }

  public put(url: string ,body?: any ): Observable<any>{
    return this.httpClient.put(this.BASE_URL+ url, body);
  }

  public delete(url: string): Observable<any>{
    return this.httpClient.delete(this.BASE_URL+ url)
  }
}
