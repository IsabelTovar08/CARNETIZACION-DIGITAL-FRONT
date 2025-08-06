import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-snackbar',
  imports: [
    CommonModule
  ],
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.css'
})
export class SnackbarComponent implements OnInit {
  @Input() type: 'success' | 'error' | 'warning' | 'info' = 'success';
  @Input() message = '';

  alertClass = '';

  ngOnInit(): void {
    console.log("holaa")
    this.alertClass = this.getBootstrapClass(this.type);

    setTimeout(() => {
      this.destroy();
    }, 4000); // 4 segundos
  }

  destroy() {
    (this as any).remove(); // elimina el custom element del DOM
  }

  getBootstrapClass(type: string): string {
    switch (type) {
      case 'success': return 'alert alert-success';
      case 'error': return 'alert alert-danger';
      case 'warning': return 'alert alert-warning';
      case 'info': return 'alert alert-info';
      default: return 'alert alert-primary';
    }
  }
}
