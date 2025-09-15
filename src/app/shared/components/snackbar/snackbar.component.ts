import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: 'app-snackbar',
  imports: [
    CommonModule,
    MatIconModule
],
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.css'
})
export class SnackbarComponent implements OnInit {
  @Input() type: 'success' | 'error' | 'warning' | 'info' = 'success';
  @Input() message = '';

  alertClass = '';

  ngOnInit(): void {
    this.alertClass = this.getBootstrapClass(this.type);
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

  getIconName(type: string): string {
  switch (type) {
    case 'success': return 'check_circle';
    case 'error': return 'error';
    case 'warning': return 'warning';
    case 'info': return 'info';
    default: return 'info';
  }
}
}
