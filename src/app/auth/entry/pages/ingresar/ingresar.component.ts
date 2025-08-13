import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-ingresar',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './ingresar.component.html',
  styleUrls: ['./ingresar.component.css']
})
export class IngresarComponent {
  ingresarForm: FormGroup;
  submitted = false;
  loading = false;
  showLoginForm = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.ingresarForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get f() {
    return this.ingresarForm.controls;
  }

  showLogin(): void {
    this.showLoginForm = true;
  }

  hideLogin(): void {
    this.showLoginForm = false;
    this.onReset();
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.ingresarForm.invalid) {
      return;
    }

    this.loading = true;

    // Simula un login exitoso
    setTimeout(() => {
      this.loading = false;
      this.router.navigate(['/dashboard']);
    }, 2000);
  }

  onReset(): void {
    this.submitted = false;
    this.ingresarForm.reset();
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
