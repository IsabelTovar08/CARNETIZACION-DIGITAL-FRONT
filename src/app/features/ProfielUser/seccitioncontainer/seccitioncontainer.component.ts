import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';

import { HeaderSeccionComponent } from '../header-seccion/header-seccion.component';
import { TargetPersonComponent } from "../../security/people/components/target-person/target-person.component";
import { FormPErsonComponent } from "../../security/people/components/form-person/form-person.component";
import { filter, Subscription } from 'rxjs';
import { SeccionOrganizationalComponent } from "../seccion-organizational/seccion-organizational.component";
@Component({
  selector: 'app-seccitioncontainer',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderSeccionComponent, TargetPersonComponent, FormPErsonComponent, SeccionOrganizationalComponent],
  templateUrl: './seccitioncontainer.component.html',
  styleUrl: './seccitioncontainer.component.css'
})
export class SeccitioncontainerComponent implements OnInit, OnDestroy {
  currentRoute: string = '';
  router = inject(Router);
  private subscription = new Subscription();

  ngOnInit() {
    this.subscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.urlAfterRedirects;
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  isOnProfile(): boolean {
    return this.currentRoute.includes('/perfil/me');
  }

  isOnOrganizational(): boolean {
    return this.currentRoute.includes('/perfil/organizational');
  }
}