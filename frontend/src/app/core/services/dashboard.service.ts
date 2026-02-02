import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DashboardStats } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = `${environment.apiUrl}/dashboard`;

  constructor(private http: HttpClient) {}

  getStats(userId?: string): Observable<DashboardStats> {
    let params = new HttpParams();
    if (userId) {
      params = params.set('userId', userId);
    }

    return this.http.get<DashboardStats>(`${this.apiUrl}/stats`, { params });
  }
}
