// core/services/auth.service.ts
import { Injectable, computed, signal } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { UserRole } from '../../shared/enums/user-role.enum';


@Injectable({ providedIn: 'root' })
export class AuthService {
    constructor(private msal: MsalService) {}


    private get claims(): any {
        return this.msal.instance.getActiveAccount()?.idTokenClaims ?? {};
    }

    get role(): UserRole | null {
        const roles: string[] = this.claims?.roles ?? [];
        if (roles.includes(UserRole.DEAL_MANAGER)) return UserRole.DEAL_MANAGER;
        if (roles.includes(UserRole.ANALYST))      return UserRole.ANALYST;
        return null;
    }

    get canWrite(): boolean {
        return this.role === UserRole.DEAL_MANAGER;
    }

    get isAnalyst(): boolean {
        return this.role === UserRole.ANALYST;
    }

    get userName(): string {
        return this.claims?.name ?? this.claims?.preferred_username ?? '';
    }

    login()  { this.msal.loginRedirect(); }
    logout() { this.msal.logoutRedirect(); }
}