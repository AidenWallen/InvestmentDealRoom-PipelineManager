import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Counterparty } from "../../shared/models/counterparty.model";
import { DealCounterpartyLink } from "../../shared/models/deal-counterparty-link.model";
import { catchError, Observable, of, throwError } from "rxjs";
import { environment } from "../../../environments/environments.development";

@Injectable({providedIn: 'root'})
export class CounterpartyService {
  constructor(private http: HttpClient) {}  

  private readonly URL = `${environment.apiBaseUrl}/counterparties`;

  getCounterparties(): Observable<Counterparty[]> {
    return this.http.get<Counterparty[]>(this.URL);
  }

  getCounterpartyById(id: string): Observable<Counterparty> {
    return this.http.get<Counterparty>(`${this.URL}/${id}`);
  }

  getCounterpartiesByDealId(dealId: string): Observable<DealCounterpartyLink[]> {
    return this.http.get<DealCounterpartyLink[]>(`${environment.apiBaseUrl}/deals/${dealId}/counterparties`)
      .pipe(catchError(() => of([])));
  }

  getDealsByCounterpartyId(counterpartyId: string): Observable<DealCounterpartyLink[]> {
    return this.http.get<DealCounterpartyLink[]>(`${this.URL}/${counterpartyId}/deals`)
      .pipe(catchError(() => of([])));
  }

  linkCounterpartyToDeal(counterpartyId: string, dealId: string, dealRole: string): Observable<DealCounterpartyLink> {
    return this.http.post<DealCounterpartyLink>(`${this.URL}/${counterpartyId}/deals`, { dealId, dealRole });
  }

  createCounterparty(counterparty: Counterparty): Observable<Counterparty> {
    return this.http.post<Counterparty>(
        `${this.URL}`,
        counterparty
    );
  }

    updateCounterparty(id: string, counterparty: Counterparty): Observable<Counterparty> {
      return this.http.put<Counterparty>(`${this.URL}/${id}`, counterparty);
    }  

    deleteCounterparty(id: string): Observable<void> {
      return this.http.delete<void>(`${this.URL}/${id}`)
        .pipe(catchError(err => {
            console.error('Error deleting counterparty:', err);
            return throwError(() => new Error('Failed to delete counterparty'));
        }));
    }

    unlinkDeal(counterpartyId: string, dealId: string): Observable<void> {
      return this.http.delete<void>(`${this.URL}/${counterpartyId}/deals/${dealId}`);
    }
}