import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Deal } from '../models/deal.model';
import { UpdateDealRequest } from '../models/update-deal-request.model';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class DealService {
  constructor(private http: HttpClient) {}

  private readonly URL = `${environment.apiBaseUrl}/deals`;
  

  getDeals(): Observable<Deal[]> {
    return this.http.get<Deal[]>(this.URL);
  }

  createDeal(userId: string, deal: Deal): Observable<Deal> {
    return this.http.post<Deal>(
      `${this.URL}?userId=${userId}`,
      deal
    );
  }

  updateDeal(
    id: string,
    request: UpdateDealRequest
  ): Observable<Deal> {

    return this.http.put<Deal>(
      `${this.URL}/${id}`, request)
      .pipe(catchError(err => {
        console.error('Error updating deal:', err);
        return throwError(() => new Error('Failed to update deal'));
      }));
  }

  deleteDeal(id: string): Observable<void> {
    return this.http.delete<void>(
      `${this.URL}/${id}`)
      .pipe(catchError(err => {
        console.error('Error deleting deal:', err);
        return throwError(() => new Error('Failed to delete deal'));
      }));
  }
}
