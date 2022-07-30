import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChildren,
} from '@angular/core';
import { ApiService } from '../api.service';
import { SharedService } from '../shared.service';
import { View } from '../enum';
import {
  ActivatedRoute,
  NavigationEnd,
  NavigationStart,
  Router,
} from '@angular/router';
import { BehaviorSubject, fromEvent } from 'rxjs';
import { HelperService } from '../helper.service';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent implements OnInit {
  readonly View = View;
  public galleryMode: any;
  public textOverlay: string = '';
  public posX: any;
  public posY: any;
  private _lastId: any;
  public viewed: any = [];
  public _routeMatch = false;
  public seen: any;
  public viewedFromStorage: any;
  public background: any;
  public readonly defaultBackgroundColor: string = '#FFFFFF';
  public activeProject = -1;
  private pos: any;

  private key = {
    up: 38,
    down: 40,
  };

  private column = {
    start: '3',
    width: '8',
  };

  public data: any;
  public projects: any;

  public $items = new BehaviorSubject(['test']);

  constructor(
    private apiService: ApiService,
    private sharedService: SharedService,
    private activatedRoute: ActivatedRoute,
    private _helperService: HelperService,
    private _router: Router,
    public cdr: ChangeDetectorRef,
    private elementRef: ElementRef,
    private viewportScroller: ViewportScroller
  ) {
    // restore gallery view when reloading app
    const viewModeFromQuery = this.activatedRoute.snapshot.queryParams['view'];
    if (viewModeFromQuery) {
      this.sharedService.$galleryMode.next(viewModeFromQuery);
    }
  }

  ngOnInit(): void {
    /*
    const keyDown$ = fromEvent(window, 'keydown');
    keyDown$.subscribe((event: any) => {
      // 40 arrow down
      if (event.keyCode == this.key.down) {
        this.pos = this.viewportScroller.getScrollPosition();
        console.log('key down', this.pos);
        //this.viewportScroller.scrollToPosition([0, 0]);
        // this.scrollByRow(this.scrollState, event);
        this.activeProject += 1;
        this.viewportScroller.scrollToPosition([0, (this.pos[1] += 100)]);

        event.preventDefault();
      }

      // 38 scroll up
      if (event.keyCode == this.key.up) {
        console.log('key up');
        //this.scrollByRow(this.scrollState, event);

        this.activeProject -= 1;

        event.preventDefault();
      }
    });*/

    // reset background to default when leaving route
    this._router.events.subscribe((event: any) => {
      if (event instanceof NavigationStart) {
        this.setAppBackground(this.defaultBackgroundColor);
      }
    });

    this.apiService.$data.subscribe((res: any) => {
      this.projects = res.project;
    });

    this.sharedService.$galleryMode.subscribe((currentMode) => {
      this.galleryMode = currentMode;
    });

    if (this._helperService.isBrowser()) {
      if (localStorage.getItem('viewed')) {
        this.seen = JSON.parse(localStorage.getItem('viewed') || 'nix');
      }
      this._router.events.subscribe((event: any) => {
        if (event instanceof NavigationEnd) {
          let currentProject = this._router.routerState.snapshot.url;
          currentProject = currentProject.replace('/', '');

          // check if route is candidate for project match
          this._routeMatch = false;
          this.projects.forEach((project: any) => {
            if (currentProject.indexOf(project.title) > -1) {
              this._routeMatch = true;
            }
          });
          // check if storage exists and project is already stored
          if (this._routeMatch) {
            if (localStorage.getItem('viewed')) {
              this.viewedFromStorage = JSON.parse(
                localStorage.getItem('viewed') || ''
              );
            }

            // push item when storage does not exist or item not already saved
            if (
              !this.viewedFromStorage ||
              (this.viewedFromStorage &&
                !this.isInStorage(this.viewedFromStorage, currentProject))
            ) {
              this.viewed.push(currentProject);
              localStorage.setItem('viewed', JSON.stringify(this.viewed));
            }
          }
        }
      });
    }

    if (this._helperService.isBrowser()) {
      const mouseMove$ = fromEvent(window, 'mousemove');
      mouseMove$.subscribe((e: any) => {
        const offset = 30;
        this.posX = e.pageX + offset + 'px';
        this.posY = e.pageY + offset + 'px';
      });

      const click$ = fromEvent(window, 'mouseover');
      click$.subscribe((event: any) => {
        const _activeId = event.target.id;

        if (this.projects && _activeId) {
          this.projects.filter((project: any) => {
            if (project.title === _activeId) {
              this._lastId = _activeId;
              this.textOverlay = project.title;
            }
            // stop overlay when leaving image
            if (this._lastId !== _activeId) {
              this.textOverlay = '';
            }
          });
        }
      });
    }
  }

  isInStorage(viewed: any, current: string): boolean {
    let _found = false;

    viewed.forEach((element: any) => {
      if (element === current) {
        _found = true;
      }
    });
    return _found;
  }

  getSpan(width: number): string {
    const spanDefault: string =
      this.column.start + '/ span ' + this.column.width;
    if (width) {
      return this.column.start + '/ span ' + width;
    }
    return spanDefault;
  }

  setAppBackground(hex: string) {
    // prevent undefined
    hex = hex && hex.length === 7 ? hex : this.defaultBackgroundColor;
    hex = hex.replace('#', '');
    let bigint = parseInt(hex, 16);
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;

    let color = r + ',' + g + ',' + b;

    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = `rgba(${color},1)`;
    color;
  }
}
