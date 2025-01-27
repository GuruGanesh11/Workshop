import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SidebarServiceService {

  private readonly sidebarVisible = new BehaviorSubject<boolean>(true);
  sidebarVisible$ = this.sidebarVisible.asObservable();

  constructor(private readonly router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateSidebarVisibility(event.urlAfterRedirects);
      }
    });
  }

  private updateSidebarVisibility(url: string) {
    if (url === '/' || url === '/login') {
      this.sidebarVisible.next(false);
    } else {
      this.sidebarVisible.next(true);
    }
  }
}
