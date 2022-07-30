import { isPlatformServer, isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class HelperService {
  platformId: Object;

  constructor(@Inject(PLATFORM_ID) platformId: Object, private router: Router) {
    this.platformId = platformId;
  }

  getWindowSize(): string {
    return 'hello from getWindowSize';
  }

  navigateByRoute(url: any): void {
    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate([url]));
  }

  isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  isServer(): boolean {
    return isPlatformServer(this.platformId);
  }
}
