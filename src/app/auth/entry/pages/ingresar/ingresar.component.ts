import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-ingresar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './ingresar.component.html',
  styleUrls: ['./ingresar.component.css']
})
export class IngresarComponent {

constructor(private router: Router, private route: ActivatedRoute) {}

  navigateToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}
