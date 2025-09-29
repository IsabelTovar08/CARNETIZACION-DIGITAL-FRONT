import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  private scrollToSubject = new Subject<string>();
  
  scrollTo$ = this.scrollToSubject.asObservable();

  scrollToSection(sectionId: string) {
    this.scrollToSubject.next(sectionId);
  }
}