import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { SystemInfo } from '../models/systemInfo';

@Injectable({
  providedIn: 'root'
})
export class SystemService {

  private controllerApi = 'api/System';
  private systemInfoChange$ = new Subject<SystemInfo>();
  public systemInfo$ = this.systemInfoChange$.asObservable();

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

  getTfsUrl() {
    this.http.get<SystemInfo>(`${this.baseUrl}${this.controllerApi}`).subscribe(res => {
      this.systemInfoChange$.next(res);
    });
  }

  refresh() {
    this.getTfsUrl();
  }

}
