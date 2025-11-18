import { SnackbarService } from './../../../../core/Services/snackbar/snackbar.service';
import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { ModificationRequestService } from '../../../../core/Services/api/ModificationRequest/modification-request.service';

@Component({
  selector: 'app-request-details',
  imports: [MatDialogModule, MatIconModule, CommonModule, MatButtonModule, MatFormFieldModule, MatInputModule, FormsModule],
  templateUrl: './request-details.component.html',
  styleUrl: './request-details.component.css'
})
export class RequestDetailsComponent {
  additionalMessage: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<RequestDetailsComponent>,
    private dialog: MatDialog,
    private apiService: ModificationRequestService,
    private snackbarService: SnackbarService
  ) {}

  /// <summary>
  /// Abre tarjeta con info completa del usuario.
  /// </summary>
  openUserDetail(): void {
    // this.dialog.open(PersonDetailCardComponent, {
    //   width: '450px',
    //   data: { userId: this.data.userId }
    // });
  }

  /// <summary>
  /// Acción aprobar.
  /// </summary>
  approve(): void {
    // Aquí llamas tu servicio
    console.log('Aprobado', this.data.id);
    // this.dialogRef.close(true);
    console.log('Mensaje adicional:', this.additionalMessage);
    this.apiService.approve(this.data.id, this.additionalMessage).subscribe(() => {
      this.snackbarService.showSuccess('Solicitud aprobada con éxito');
      this.dialogRef.close(true);
    });
  }

  /// <summary>
  /// Acción rechazar.
  /// </summary>
  reject(): void {
    console.log('Rechazado', this.data.id);
    console.log('Mensaje adicional:', this.additionalMessage);
    this.apiService.reject(this.data.id, this.additionalMessage).subscribe(() => {
      this.snackbarService.showSuccess('Solicitud rechazada con éxito');
      this.dialogRef.close(true);
    });
    this.dialogRef.close(true);
  }
}
