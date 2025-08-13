import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-ingresar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './ingresar.component.html',
  styleUrls: ['./ingresar.component.css']
})
export class IngresarComponent {

  constructor(private router: Router) {}

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}
