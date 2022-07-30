import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { View } from './enum';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  public $galleryMode = new BehaviorSubject(View.Default);

  constructor() {
    // this.$galleryMode.subscribe((v) => console.log('MODE', v));
  }
}
