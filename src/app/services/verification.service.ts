import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VerificationService {

  private controllerApi = 'api/Verification';

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }


  verify(key: string): Observable<boolean> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    const body = JSON.stringify(key);
    return this.http.post<boolean>(`${this.baseUrl}${this.controllerApi}`, body, { headers: headers });
  }

}
