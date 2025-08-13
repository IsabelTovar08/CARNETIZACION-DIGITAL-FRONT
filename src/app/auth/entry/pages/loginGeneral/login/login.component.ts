// login.component.ts
import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../../core/Services/auth/auth-service.service';
import { Subject } from 'rxjs';
import { takeUntil, take, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('emailInput') emailInput!: ElementRef<HTMLInputElement>;

  loginForm!: FormGroup;
  showPassword = false;
  isLoading = false;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngAfterViewInit(): void {
    // evita ExpressionChanged error
    queueMicrotask(() => this.emailInput?.nativeElement?.focus());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  goToForgotPassword(): void {
    this.router.navigate(['/forgotten-password']);
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const creds = this.loginForm.getRawValue();

    this.authService.login(creds).pipe(
      take(1),
      finalize(() => (this.isLoading = false)),
      takeUntil(this.destroy$)
    ).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: err => {
        console.error('Error al iniciar sesión:', err);
        // aquí puedes setear un mensaje para la UI
      }
    });
  }
}
