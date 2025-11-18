import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AttendanceItem } from '../../../core/Models/operational/attendance.model';

@Component({
  selector: 'app-attendance-modal',
  standalone: true,
  imports: [MatDialogModule, MatTableModule, MatButtonModule, MatIconModule, CommonModule],
  template: `
    <h2 mat-dialog-title class="dialog-title">👥 Asistentes al Evento: {{ data.eventName }}</h2>
    <mat-dialog-content class="dialog-content">
      <div class="table-container" *ngIf="data.attendances.length > 0; else noData">
        <table mat-table [dataSource]="data.attendances" class="attendance-table mat-elevation-z8">
          <ng-container matColumnDef="personFullName">
            <th mat-header-cell *matHeaderCellDef class="header-cell">Nombre Completo</th>
            <td mat-cell *matCellDef="let element" class="body-cell">{{ element.personFullName }}</td>
          </ng-container>
          <ng-container matColumnDef="timeOfEntryStr">
            <th mat-header-cell *matHeaderCellDef class="header-cell">⏰ Hora de Entrada</th>
            <td mat-cell *matCellDef="let element" class="body-cell">{{ element.timeOfEntryStr }}</td>
          </ng-container>
          <ng-container matColumnDef="timeOfExitStr">
            <th mat-header-cell *matHeaderCellDef class="header-cell">⏰ Hora de Salida</th>
            <td mat-cell *matCellDef="let element" class="body-cell">{{ element.timeOfExitStr || 'N/A' }}</td>
          </ng-container>
          <ng-container matColumnDef="accessPointOfEntryName">
            <th mat-header-cell *matHeaderCellDef class="header-cell">🚪 Punto de Entrada</th>
            <td mat-cell *matCellDef="let element" class="body-cell">{{ element.accessPointOfEntryName }}</td>
          </ng-container>
          <ng-container matColumnDef="accessPointOfExitName">
            <th mat-header-cell *matHeaderCellDef class="header-cell">🚪 Punto de Salida</th>
            <td mat-cell *matCellDef="let element" class="body-cell">{{ element.accessPointOfExitName || 'N/A' }}</td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="displayedColumns" class="header-row"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="body-row"></tr>
        </table>
      </div>
      <ng-template #noData>
        <div class="no-data-container">
          <mat-icon class="no-data-icon">people_outline</mat-icon>
          <p class="no-data-text">No hay asistentes registrados para este evento.</p>
        </div>
      </ng-template>
    </mat-dialog-content>
    <mat-dialog-actions align="end" class="dialog-actions">
      <button mat-raised-button color="primary" mat-dialog-close class="close-button">Cerrar</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-title {
      background: rgba(173, 216, 230, 0.8);
      color: #333;
      margin: 0;
      padding: 20px;
      border-radius: 8px 8px 0 0;
      font-weight: 500;
      text-align: center;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      border-bottom: 1px solid rgba(173, 216, 230, 0.5);
    }

    .dialog-content {
      padding: 24px;
      max-height: 70vh;
      overflow-y: auto;
    }

    .table-container {
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }

    .attendance-table {
      width: 100%;
      background: white;
    }

    .header-row {
      background: #f8f9fa;
      height: 56px;
    }

    .header-cell {
      color: #495057;
      font-weight: 600;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 16px;
      border-bottom: 2px solid #dee2e6;
    }

    .body-row {
      transition: background-color 0.2s ease;
    }

    .body-row:hover {
      background-color: #f8f9ff;
    }

    .body-cell {
      color: #212529;
      font-size: 14px;
      padding: 16px;
      border-bottom: 1px solid #e9ecef;
    }

    .no-data-container {
      text-align: center;
      padding: 40px 20px;
      background: #f8f9fa;
      border-radius: 8px;
      margin: 20px 0;
    }

    .no-data-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #6c757d;
      margin-bottom: 16px;
    }

    .no-data-text {
      color: #6c757d;
      font-size: 16px;
      margin: 0;
      font-weight: 500;
    }

    .dialog-actions {
      padding: 16px 24px;
      background: #f8f9fa;
      border-top: 1px solid #e9ecef;
    }

    .close-button {
      border-radius: 24px;
      padding: 8px 24px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .close-button:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
  `]
})
export class AttendanceModalComponent {
  displayedColumns: string[] = ['personFullName', 'timeOfEntryStr', 'timeOfExitStr', 'accessPointOfEntryName', 'accessPointOfExitName'];

  constructor(
    public dialogRef: MatDialogRef<AttendanceModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { eventName: string; attendances: AttendanceItem[] }
  ) {}
}