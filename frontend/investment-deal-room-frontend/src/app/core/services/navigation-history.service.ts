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
        this.history.push(e.urlAfterRedirects);
        return;
      }
      const url = e.urlAfterRedirects;
      const isListPage = url.split('/').filter(s => s.length > 0).length <= 1;
      if (isListPage) {
        this.history = [url];
      } else {
        this.history.push(url);
      }
    });
  }

  back(fallback: string = '/'): void {
    this.history.pop();
    const previous = this.history.pop();
    this.goingBack = true;
    this.router.navigateByUrl(previous ?? fallback);
  }
}
