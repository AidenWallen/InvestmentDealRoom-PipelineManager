import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { DealActivity } from '../../shared/models/deal-activity';
import { environment } from '../../../environments/environments.development';

@Injectable({ providedIn: 'root' })
export class ActivityFeedService {
  private readonly URL = `${environment.apiBaseUrl}/deals`;

  constructor(private http: HttpClient) {}

  getActivitiesByDealId(dealId: string): Observable<DealActivity[]> {
    return this.http
      .get<DealActivity[]>(`${this.URL}/${dealId}/activity`)
      .pipe(catchError(() => of([])));
  }
}
