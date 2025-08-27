import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-entry-component',
  imports: [RouterModule, CommonModule],
  templateUrl: './auth-navbar.component.component.html',
  styleUrl: './auth-navbar.component.component.css'
})
export class AuthNavbarComponent implements OnInit, AfterViewInit {
  @ViewChild('navMenu', { static: true }) navMenu!: ElementRef;
  @ViewChild('activeIndicator', { static: true }) activeIndicator!: ElementRef;

  constructor(private router: Router) {}

  ngOnInit() {
    // Escucha cambios de ruta
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      setTimeout(() => this.updateIndicatorPosition(), 50);
    });
  }

  ngAfterViewInit() {
    // cola el indicador automatico en el inicio
    setTimeout(() => this.updateIndicatorPosition(), 100);
  }

  updateIndicatorPosition() {
    const activeLink = this.navMenu.nativeElement.querySelector('.active-link');
    const indicator = this.activeIndicator.nativeElement;
    
    if (activeLink && indicator) {
      const navMenuRect = this.navMenu.nativeElement.getBoundingClientRect();
      const activeLinkRect = activeLink.getBoundingClientRect();
      
      // mira la posición relativa de la ruta
      const leftPosition = activeLinkRect.left - navMenuRect.left + (activeLinkRect.width / 2) - 30;
      
      indicator.style.left = `${leftPosition}px`;
      indicator.style.opacity = '1';
    } else {
      // Si no hay una ruta correcta, ocultar el indicador
      indicator.style.opacity = '0';
    }
  }
}