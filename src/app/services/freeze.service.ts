import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FreezeParam } from '../models/freezeparam';

@Injectable({
  providedIn: 'root'
})
export class FreezeService {

  private controllerApi = 'api/Freeze';

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

  freezeBranch(param: FreezeParam): Observable<boolean> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    const body = JSON.stringify(param);
    return this.http.post<boolean>(`${this.baseUrl}${this.controllerApi}`, body, {headers: headers});
  }

}
