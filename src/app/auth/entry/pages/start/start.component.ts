import { Component, ElementRef } from '@angular/core';

@Component({
  selector: 'app-start',
  imports: [],
  templateUrl: './start.component.html',
  styleUrl: './start.component.css'
})
export class StartComponent {
   inView = false;             // (ES) clase que activa animaciones CSS
  private observer?: IntersectionObserver;

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    // (ES) Activa animaciones cuando el hero entra al viewport
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        entries => {
          const entry = entries[0];
          if (entry.isIntersecting) {
            this.inView = true;
            this.observer?.disconnect(); // disparar solo una vez
          }
        },
        { threshold: 0.2 }
      );
      this.observer.observe(this.el.nativeElement as Element);
    } else {
      // (ES) Fallback si no hay soporte
      this.inView = true;
    }
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
