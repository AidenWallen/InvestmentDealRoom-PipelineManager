import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { UpdateDealRequest } from '../../shared/models/update-deal-request.model';
import { environment } from '../../../environments/environments.development';
import { Deal } from '../../shared/models/deal.model';
import { PipelineStage } from '../../shared/enums/pipeline-stage.enum';

@Injectable({
  providedIn: 'root',
})
export class DealService {
  constructor(private http: HttpClient) {}

  private readonly URL = `${environment.apiBaseUrl}/deals`;

  getDeals(): Observable<Deal[]> {
    return this.http.get<Deal[]>(this.URL);
  }

  getDealById(id: string): Observable<Deal> {
    return this.http.get<Deal>(`${this.URL}/${id}`);
  }

  createDeal(deal: Deal, userId: string): Observable<Deal> {
    return this.http.post<Deal>(`${this.URL}?userId=${encodeURIComponent(userId)}`, deal);
  }

  updateDeal(id: string, request: UpdateDealRequest): Observable<Deal> {
    return this.http.put<Deal>(`${this.URL}/${id}`, request);
  }

  updateStage(id: string, toStage: PipelineStage): Observable<Deal> {
    const stageKey = Object.entries(PipelineStage).find(([, v]) => v === toStage)?.[0] ?? toStage;
    return this.http.patch<Deal>(`${this.URL}/${id}/stage`, { pipelineStage: stageKey });
  }

  deleteDeal(id: string): Observable<void> {
    return this.http.delete<void>(`${this.URL}/${id}`).pipe(
      catchError((err) => {
        console.error('Error deleting deal:', err);
        return throwError(() => new Error('Failed to delete deal'));
      }),
    );
  }
}
