import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Deal } from '../models/deal.model';

@Injectable({
  providedIn: 'root',
})
export class DealService {

  constructor(private http: HttpClient) {}

  getDeals(): Observable<Deal[]> {
    return this.http.get<Deal[]>('http://localhost:8080/api/v1/deals');
  }

}
