import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter, debounceTime, takeUntil } from 'rxjs/operators';
import { fromEvent, Subject } from 'rxjs';
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: 'app-auth-navbar-component',
  imports: [RouterModule, CommonModule, MatIconModule, MatMenuModule, MatButtonModule],
  templateUrl: './auth-navbar.component.component.html',
  styleUrl: './auth-navbar.component.component.css'
})
export class AuthNavbarComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('navMenu', { static: true }) navMenu!: ElementRef<HTMLElement>;
  @ViewChild('activeIndicator', { static: true }) activeIndicator!: ElementRef<HTMLElement>;

  isMenuOpen = false;
  currentLabel = 'Home';
  currentIcon = 'home';
  currentUrl = '/';

  // Para limpiar suscripciones/observers
  private destroy$ = new Subject<void>();
  private menuResizeObserver?: ResizeObserver;

  constructor(private router: Router, private ar: ActivatedRoute) {}

  ngOnInit() {
    // Update inicial (cubre refresh)
    this.updateFromRoute();

    // Update en cambios de navegación
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd), takeUntil(this.destroy$))
      .subscribe(() => this.updateFromRoute());

    // Recalcula en cambios de tamaño de ventana / orientación
    fromEvent(window, 'resize')
      .pipe(debounceTime(80), takeUntil(this.destroy$))
      .subscribe(() => this.updateIndicatorPosition());

    fromEvent(window, 'orientationchange')
      .pipe(debounceTime(80), takeUntil(this.destroy$))
      .subscribe(() => {
        // Espera al reflow tras rotar
        setTimeout(() => this.updateIndicatorPosition(), 120);
      });
  }

  ngAfterViewInit() {
    // Observa cambios de tamaño del contenedor del menú (breakpoints, fuentes, etc.)
    if ('ResizeObserver' in window && this.navMenu?.nativeElement) {
      this.menuResizeObserver = new ResizeObserver(() => {
        // Debounce simple con rAF para evitar múltiples cálculos
        requestAnimationFrame(() => this.updateIndicatorPosition());
      });
      this.menuResizeObserver.observe(this.navMenu.nativeElement);
    }

    // Cuando las fuentes se cargan, pueden cambiar el ancho de los ítems
    // @ts-ignore
    if (document.fonts?.ready) {
      // @ts-ignore
      document.fonts.ready.then(() => this.updateIndicatorPosition());
    }

    // Primer posicionamiento cuando el DOM ya está
    setTimeout(() => this.updateIndicatorPosition(), 100);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.menuResizeObserver?.disconnect();
  }

  // Lee datos de la ruta activa más profunda
  private updateFromRoute() {
    const deepest = this.getDeepest(this.router.routerState.root);
    const data = deepest?.snapshot?.data ?? {};
    this.currentLabel = data['title'] ?? 'Home';
    this.currentIcon  = data['icon']  ?? 'home';
    this.currentUrl = this.router.url.split('?')[0].split('#')[0];

    // Reposiciona tras pintar
    setTimeout(() => this.updateIndicatorPosition(), 50);
  }

  updateIndicatorPosition() {
    const menuEl = this.navMenu?.nativeElement;
    const indicatorEl = this.activeIndicator?.nativeElement;
    if (!menuEl || !indicatorEl) return;

    const activeLink = menuEl.querySelector('.active-link') as HTMLElement | null;

    if (activeLink) {
      const navMenuRect = menuEl.getBoundingClientRect();
      const activeLinkRect = activeLink.getBoundingClientRect();

      const leftPosition =
        activeLinkRect.left - navMenuRect.left + (activeLinkRect.width / 2) - 30;

      indicatorEl.style.left = `${leftPosition}px`;
      indicatorEl.style.opacity = '1';
    } else {
      indicatorEl.style.opacity = '0';
    }
  }

  private getDeepest(route: ActivatedRoute): ActivatedRoute {
    while (route.firstChild) route = route.firstChild;
    return route;
  }

  // Si se abre/cierra un menú hamburguesa, se llama después del toggle
  onMenuToggled(open: boolean) {
    this.isMenuOpen = open;
    setTimeout(() => this.updateIndicatorPosition(), 50);
  }
}
