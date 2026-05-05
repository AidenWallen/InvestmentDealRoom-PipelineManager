import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from "./components/sidebar-menu/sidebar";
import { MsalService } from '@azure/msal-angular';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Sidebar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('investment-deal-room-backend');

  isIframe = window !== window.parent && !window.opener;

  constructor(private authService: MsalService) {}

  ngOnInit(): void {
    this.authService.handleRedirectObservable().subscribe({
      next: (result) => {
        if (result) {
          this.authService.instance.setActiveAccount(result.account);
        } else {
          const accounts = this.authService.instance.getAllAccounts();
          if (accounts.length > 0) {
            this.authService.instance.setActiveAccount(accounts[0]);
          }
        }
      }
    });
  }
}