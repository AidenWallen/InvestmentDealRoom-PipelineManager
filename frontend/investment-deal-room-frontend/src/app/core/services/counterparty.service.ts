import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Counterparty } from "../../shared/models/counterparty.model";
import { catchError, Observable, throwError } from "rxjs";
import { environment } from "../../../environments/environments.development";

@Injectable({providedIn: 'root'})
export class CounterpartyService {
  constructor(private http: HttpClient) {}  

  private readonly URL = `${environment.apiBaseUrl}/counterparties`;

  getCounterparties(): Observable<Counterparty[]> {
    return this.http.get<Counterparty[]>(this.URL);
  }

  createCounterparty(counterparty: Counterparty): Observable<Counterparty> {
    return this.http.post<Counterparty>(
        `${this.URL}`,
        counterparty
    );
  }

    updateCounterparty(id: string, counterparty: Counterparty): Observable<Counterparty> {
      return this.http.put<Counterparty>(
        `${this.URL}/${id}`,
        counterparty
        )
        .pipe(catchError(err => {
            console.error('Error updating counterparty:', err);
            return throwError(() => new Error('Failed to update counterparty'));
        } ));
    }  

    deleteCounterparty(id: string): Observable<void> {
      return this.http.delete<void>(`${this.URL}/${id}`)
        .pipe(catchError(err => {
            console.error('Error deleting counterparty:', err);
            return throwError(() => new Error('Failed to delete counterparty'));
        }));
    }
}