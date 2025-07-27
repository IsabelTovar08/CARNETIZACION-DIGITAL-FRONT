import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationStateService {

  constructor() { }

 private pathTitlesSubject = new BehaviorSubject<string[]>([]); // ['Seguridad', 'Security', 'Personas']
  pathTitles$ = this.pathTitlesSubject.asObservable();

  setPathTitles(titles: string[]) {
    this.pathTitlesSubject.next(titles);
  }
}
