import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private endpointUrl: string = '';
  private serverHost: string = 'https://play.polychrom.dev';
  private localHost: string = 'http://localhost:4200';
  private endpoint: string = '/assets/json/showcase.json';

  data: Observable<any> | undefined;
  public $data = new ReplaySubject();

  constructor(
    private http: HttpClient,
    @Inject(DOCUMENT) private _document: Document
  ) {
    if (this._document.location.hostname.indexOf('localhost') > -1) {
      this.endpointUrl = this.localHost += this.endpoint;
    } else {
      this.endpointUrl = this.serverHost += this.endpoint;
    }
    this.getData();
  }

  getData() {
    this.http.get(this.endpointUrl).subscribe((res: any) => {
      this.$data.next(res);
    });
  }
}
