import { Injectable, signal } from '@angular/core';
import { UserRole } from '../../shared/enums/user-role.enum';

@Injectable({ providedIn: 'root' })
export class UserService {
  private _role = signal<UserRole | null>(null);
  private _department = signal<string>('');

  readonly role = this._role.asReadonly();
  readonly department = this._department.asReadonly();

  setRole(role: UserRole): void {
    this._role.set(role);
  }

  setDepartment(dept: string): void {
    this._department.set(dept);
  }
}
