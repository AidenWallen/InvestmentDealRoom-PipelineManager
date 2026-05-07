// core/services/auth.service.ts
import { Injectable, signal } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { UserRole } from '../../shared/enums/user-role.enum';
import { environment } from '../../../environments/environments.development';


@Injectable({ providedIn: 'root' })
export class AuthService {
    private accessClaims = signal<any>(null);

    constructor(private msal: MsalService) {
        this.loadAccessClaims();
    }

    private loadAccessClaims(): void {
        const account = this.msal.instance.getActiveAccount();
        if (!account) return;

        this.msal.acquireTokenSilent({
            scopes: [environment.azureApiScope],
            account,
        }).subscribe({
            next: (result) => {
                try {
                    const payload = result.accessToken.split('.')[1];
                    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
                    this.accessClaims.set(JSON.parse(decoded));
                } catch {
                    console.error('[AuthService] Failed to decode access token');
                }
            },
        });
    }

    private get claims(): any {
        return this.accessClaims() ?? this.msal.instance.getActiveAccount()?.idTokenClaims ?? {};
    }

    get role(): UserRole | null {
        const roles: string[] = this.claims?.roles ?? [];
        const match = Object.entries(UserRole).find(([key]) => roles.includes(key));
        return match ? (match[1] as UserRole) : null;
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

    get userId(): string {
        return this.claims?.oid ?? this.claims?.sub ?? '';
    }

    login()  { this.msal.loginRedirect(); }
    logout() { this.msal.logoutRedirect(); }
}