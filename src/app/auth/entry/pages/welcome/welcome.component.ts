import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent {

  isContactModalOpen = false;

  constructor(private router: Router, private route: ActivatedRoute) {}

  navigateToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  openContactModal(): void {
    this.isContactModalOpen = true;
  }

  closeContactModal(): void {
    this.isContactModalOpen = false;
  }
}
