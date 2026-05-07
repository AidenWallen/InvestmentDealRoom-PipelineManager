import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, tap } from 'rxjs';
import { User } from '../models/user';
import { environment } from '../../../environments/environments.development';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly URL = `${environment.apiBaseUrl}/users`;

  private _department = signal<string>('');
  readonly department = this._department.asReadonly();

  constructor(private http: HttpClient) {}

  loadDepartment(azureId: string): Observable<User | null> {
    return this.http.get<User>(`${this.URL}/${azureId}/department`).pipe(
      tap((user) => this._department.set(user.department ?? '')),
      catchError((err) => {
        if (err.status === 404) return of(null);
        throw err;
      }),
    );
  }

  updateDepartment(azureId: string, department: string): Observable<User> {
    return this.http
      .patch<User>(`${this.URL}/${azureId}/department`, { department })
      .pipe(tap((user) => this._department.set(user.department ?? '')));
  }
}
