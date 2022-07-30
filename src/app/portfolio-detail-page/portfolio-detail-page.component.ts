import { identifierName } from '@angular/compiler';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fromEvent, Subscription } from 'rxjs';
import { ApiService } from '../api.service';
import { HelperService } from '../helper.service';

@Component({
  selector: 'app-portfolio-detail-page',
  templateUrl: './portfolio-detail-page.component.html',
  styleUrls: ['./portfolio-detail-page.component.scss'],
})
export class PortfolioDetailPageComponent implements OnInit, OnDestroy {
  public projects: any;
  public project: any;
  private _match: boolean = false;
  private _id: string = '';
  public posX: any;
  public posY: any;
  public prev: boolean = false;
  public next: boolean = false;
  public projectsSum: number = 0;
  public currentProjectNumber: number = 0;
  private offsetX = 0;

  public nextProject = undefined;
  public prevProject = undefined;
  public nextProjectNumber: number = 0;
  public prevProjectNumber: number = 0;

  private _subscriptionData!: Subscription;
  private _subscriptionRoute!: Subscription;
  private _subscriptionMouseMove!: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private router: Router,
    private helperService: HelperService
  ) {}

  ngOnInit(): void {
    this._subscriptionRoute = this.activatedRoute.params.subscribe(() => {
      this._subscriptionData = this.apiService.$data.subscribe((res: any) => {
        this.projects = res.project;
        this.projectsSum = this.projects.length;
        this._match = false;

        for (let i = 0; i < this.projects.length; i++) {
          this._id = this.activatedRoute.snapshot.params['id'];
          if (this.projects[i].project_dir === this._id) {
            this.project = this.projects[i];

            /* prev project */
            if (i === 0) {
              this.prevProject = this.projects[this.projects.length - 1].title;
            }

            if (i > 0) {
              this.prevProject = this.projects[i - 1].title;
            }

            /* next project */
            if (i === this.projects.length - 1) {
              this.nextProject = this.projects[0].title;
            }

            if (i < this.projects.length - 1) {
              this.nextProject = this.projects[i + 1].title;
            }

            this._match = true;
          }
        }
        if (!this._match && this._id.indexOf('404') === -1) {
          this.router.navigate(['404']);
        }
      });
    });

    if (this.helperService.isBrowser()) {
      const mouseMove$ = fromEvent(window, 'mousemove');
      this._subscriptionMouseMove = mouseMove$.subscribe((event: any) => {
        const offsetY = 30;
        this.posX = event.pageX + this.offsetX + 'px';
        this.posY = event.pageY + offsetY + 'px';

        if (event.target.role === 'prev_project') {
          this.prev = true;
          this.offsetX = 30;
        } else {
          this.prev = false;
        }

        if (event.target.role === 'next_project') {
          this.next = true;
          this.offsetX = -180;
        } else {
          this.next = false;
        }
      });
    }
  }

  ngOnDestroy() {
    this._subscriptionRoute.unsubscribe();
    this._subscriptionData.unsubscribe();

    if (this.helperService.isBrowser()) {
      this._subscriptionMouseMove.unsubscribe();
    }

    //console.log('unsub from route', this._subscriptionRoute.closed);
    //console.log('unsub from data', this._subscriptionData.closed);
    //console.log('unsub from mouse', this._subscriptionMouseMove.closed);
  }

  navigateProjects(route: any) {
    this.router.navigate([route]);
  }
}
