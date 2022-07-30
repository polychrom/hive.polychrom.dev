import { ViewportScroller } from '@angular/common';
import { Component } from '@angular/core';
import {
  Router,
  Event,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  ActivatedRoute,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { fromEvent, take } from 'rxjs';
import { HelperService } from './helper.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'play.polychrom.dev';
  scrollPosition = 0;
  isScrollTopActive = false;
  public elements = 3;
  public routeChanged = false;
  public is404: boolean = false;

  lastPoppedUrl: any = '';
  yScrollStack: number[] = [];

  constructor(
    private router: Router,
    private helperService: HelperService,
    public activatedRoute: ActivatedRoute,
    private viewportScroller: ViewportScroller
  ) {
    if (this.helperService.isBrowser()) {
      const scrollPosition$ = fromEvent(window, 'scroll');
      scrollPosition$.subscribe(() => {
        if (window.scrollY > window.innerHeight / 2) {
          this.isScrollTopActive = true;
        } else {
          this.isScrollTopActive = false;
        }
      });

      // const resize$ = fromEvent(window, 'resize');
      // resize$.subscribe((val) => console.log(window.innerWidth));

      this.router.events.subscribe((event: Event) => {
        if (event instanceof NavigationEnd) {
        }
        if (event instanceof NavigationEnd) {
          const currentUrl = this.router.routerState.snapshot.url;
          if (currentUrl.indexOf('404') > -1) {
            this.is404 = true;
          } else {
            this.is404 = false;
          }
        }
      });
    }
  }

  ngOnInit(): void {
    if (this.helperService.isBrowser()) {
      this.router.events.subscribe((event: Event) => {
        if (event instanceof NavigationStart) {
          if (event.url !== this.lastPoppedUrl) {
            console.log('Y', Math.floor(window.scrollY));
            this.yScrollStack.push(Math.floor(window.scrollY));
          }
        }
      });

      fromEvent(window, 'popstate').subscribe((event: any) => {
        if (event.target.location.search) {
          this.lastPoppedUrl = '/' + event.target.location.search;
        } else {
          this.lastPoppedUrl = event.target.location.pathname;
        }
        console.log('POP', this.lastPoppedUrl);

        this.router.events.pipe(take(1)).subscribe((event: Event) => {
          if (event instanceof NavigationStart) {
            console.log('NAV', event.url);
            if (
              event.url === this.lastPoppedUrl &&
              this.yScrollStack.length > 0
            ) {
              console.log('restore from pop', this.yScrollStack);
              let y = this.yScrollStack.pop();
              console.log('scrollto y', y);
              this.viewportScroller.scrollToPosition([0, y || 0]);

              //window.scrollTo(0, this.yScrollStack.pop() || 0);
            }
          }
        });
      });
    }
  }

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }
}
