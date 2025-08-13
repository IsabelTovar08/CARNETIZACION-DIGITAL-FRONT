import { CommonModule } from '@angular/common';
import {
  AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild,
  ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import {
  FormBuilder, FormGroup, ReactiveFormsModule, Validators,
  AbstractControl, ValidationErrors, FormControl
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { finalize, take, takeUntil } from 'rxjs/operators';
import { AuthService } from '../../../../../core/Services/auth/auth-service.service';

type PasswordForm = FormGroup<{
  newPassword: FormControl<string>;
  confirmPassword: FormControl<string>;
}>;

@Component({
  selector: 'app-new-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.css'], // <-- plural
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewPasswordComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('passwordInput') passwordInput!: ElementRef<HTMLInputElement>;

  passwordForm!: PasswordForm;
  showPassword = false;
  isLoading = false;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.passwordForm = this.fb.group({
      newPassword: this.fb.control('', {
        validators: [Validators.required, Validators.minLength(6)],
        nonNullable: true
      }),
      confirmPassword: this.fb.control('', {
        validators: [Validators.required, Validators.minLength(6)],
        nonNullable: true
      })
    }, { validators: this.passwordMatchValidator });
  }

  ngAfterViewInit(): void {
    queueMicrotask(() => this.passwordInput?.nativeElement?.focus());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Validador de coincidencia de contraseñas, a base del form, nos falta crear un servicio para actualizar contraseña y validar 
  private passwordMatchValidator = (group: AbstractControl): ValidationErrors | null => {
    const p = group.get('newPassword')?.value ?? '';
    const c = group.get('confirmPassword')?.value ?? '';
    return p && c && p !== c ? { passwordMismatch: true } : null;
  };

  //Los Mensajes de error por del campo
  getFieldError(field: 'newPassword' | 'confirmPassword'): string | null {
    const ctrl = this.passwordForm.get(field);
    if (!ctrl) return null;

    // Muestra mensajes solo si el usuario ya interactuó
    if (!(ctrl.touched || ctrl.dirty)) return null;

    if (ctrl.hasError('required')) return 'Este campo es obligatorio';
    if (ctrl.hasError('minlength')) return 'Debe tener al menos 6 caracteres';

    // Error de coincidencia: se muestra bajo "Confirmar contraseña"
    if (field === 'confirmPassword' && this.passwordForm.hasError('passwordMismatch')) {
      return 'Las contraseñas no coinciden';
    }

    return null;
  }

  // ---- Navegación / UI ----
  goToConfirmNewPassword(): void {
    this.router.navigate(['/modal-new-password']);
  }

  goBack(): void {
    this.router.navigate(['/login']);
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
    this.cdr.markForCheck();
  }

  // ---- Submit ----
  onSubmit(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      this.cdr.markForCheck();
      return;
    }

    this.isLoading = true;
    this.cdr.markForCheck();

    const formData = {
      // normalmente enviarías ambas y/o token de recuperación
      newPassword: this.passwordForm.controls.newPassword.value
    };

    // TODO: sustituye por updatePassword en tu AuthService
    this.authService.login(formData as any).pipe(
      take(1),
      finalize(() => {
        this.isLoading = false;
        this.cdr.markForCheck();
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: () => this.goToConfirmNewPassword(),
      error: (err: any) => {
        console.error('Error al actualizar la contraseña', err);
      }
    });
  }
}
