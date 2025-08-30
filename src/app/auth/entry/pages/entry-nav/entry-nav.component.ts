import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { AuthNavbarComponent } from "../auth-navbar/auth-navbar.component.component";

@Component({
  selector: 'app-entry-nav',
  imports: [CommonModule, RouterModule, AuthNavbarComponent],
  templateUrl: './entry-nav.component.html',
  styleUrl: './entry-nav.component.css'
})
export class EntryNavComponent {
  isAuthRoute = false;

   constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.isAuthRoute = event.url.includes('/auth');
      });
  }
}
