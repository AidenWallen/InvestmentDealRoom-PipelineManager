import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class NavigationHistoryService {
  private history: string[] = [];
  private goingBack = false;

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((e: NavigationEnd) => {
      if (this.goingBack) {
        this.goingBack = false;
        return;
      }
      this.history.push(e.urlAfterRedirects);
    });
  }

  back(fallback: string = '/'): void {
    this.history.pop();
    const previous = this.history.pop();
    this.goingBack = true;
    this.router.navigateByUrl(previous ?? fallback);
  }
}
