import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { HelperService } from '../helper.service';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss'],
})
export class PageNotFoundComponent implements OnInit {
  projects: any;
  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.$data.subscribe((res: any) => {
      this.projects = res.project;
    });
  }
}
