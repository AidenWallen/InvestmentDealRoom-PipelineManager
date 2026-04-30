import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Deal } from '../models/deal.model';
import { UpdateDealRequest } from '../models/update-deal-request.model';

@Injectable({
  providedIn: 'root',
})
export class DealService {
  constructor(private http: HttpClient) {}

  getDeals(): Observable<Deal[]> {
    return this.http.get<Deal[]>('http://localhost:8080/api/v1/deals');
  }

  createDeal(userId: string, deal: Deal): Observable<Deal> {
    return this.http.post<Deal>(
      `http://localhost:8080/api/v1/deals?userId=${userId}`,
      deal
    );
  }

  updateDeal(
    id: string,
    request: UpdateDealRequest
  ): Observable<Deal> {

    return this.http.put<Deal>(
      `http://localhost:8080/api/v1/deals/${id}`,
      request
    );
  }

  deleteDeal(id: string): Observable<void> {
    return this.http.delete<void>(
      `http://localhost:8080/api/v1/deals/${id}`
    );
  }
}
