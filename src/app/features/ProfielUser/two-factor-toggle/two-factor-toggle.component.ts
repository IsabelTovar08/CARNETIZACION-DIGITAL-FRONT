import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AuthService } from '../../../core/Services/auth/auth-service.service';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatDividerModule } from "@angular/material/divider";
import { MatCardModule } from "@angular/material/card";
import { UserStoreService } from '../../../core/Services/auth/user-store.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-two-factor-toggle',
  templateUrl: './two-factor-toggle.component.html',
  styleUrls: ['./two-factor-toggle.component.css'],
  imports: [MatProgressSpinnerModule, MatSlideToggleModule, MatDividerModule, MatCardModule, CommonModule]
})
export class TwoFactorToggleComponent implements OnInit {

  /// <summary>
  /// Estado actual del 2FA
  /// </summary>
  twoFactorEnabled = false;

  /// <summary>
  /// Indicador de carga
  /// </summary>
  loading = false;

  constructor(private twofactorService: AuthService,
    private userService: UserStoreService
  ) { }

  ngOnInit(): void {
    // Aquí puedes cargar el estado real del backend si existe un GET.
    // Por ahora, arrancamos en "false" como estado inicial.
    this.twoFactorEnabled = this.userService.user()?.twoFactorEnabled ?? false;
  }

  /// <summary>
  /// Confirma la acción y alterna 2FA sin enviar parámetros
  /// </summary>
  async onToggleChange(): Promise<void> {

    // Guardar el estado anterior por si cancela
    const previousState = this.twoFactorEnabled;

    // Revertimos temporalmente para no mostrar el cambio sin confirmar
    this.twoFactorEnabled = previousState;

    const isActivating = !previousState;

    // Mensajes dinámicos
    const title = isActivating
      ? '¿Deseas activar la autenticación en dos pasos?'
      : '¿Deseas desactivar la autenticación en dos pasos?';

    const text = isActivating
      ? 'Deberás ingresar un código temporal cada vez que inicies sesión.'
      : 'Tu cuenta dependerá solamente de tu contraseña.';

    // Mostrar alerta de confirmación
    const confirm = await Swal.fire({
      icon: 'question',
      title,
      text,
      showCancelButton: true,
      confirmButtonText: isActivating ? 'Sí, activar' : 'Sí, desactivar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    });

    if (!confirm.isConfirmed) {
      // Si cancela → mantener el estado original
      this.twoFactorEnabled = previousState;
      return;
    }

    // CONFIRMADO
    this.loading = true;

    try {
      await this.twofactorService.toggleTwoFactor().toPromise();

      // Alternar visualmente después de SÍ confirmado y éxito del backend
      this.twoFactorEnabled = !previousState;

      await Swal.fire({
        icon: 'success',
        title: this.twoFactorEnabled
          ? 'Autenticación en dos pasos activada'
          : 'Autenticación en dos pasos desactivada',
        timer: 1500,
        showConfirmButton: false
      });

    } catch (err) {
      await Swal.fire({
        icon: 'error',
        title: 'Error al cambiar el estado del 2FA'
      });

      // Mantener estado original por error
      this.twoFactorEnabled = previousState;
    }

    this.loading = false;
  }

}
