import { Component } from '@angular/core';
import { GenericTableComponent } from "../../../../shared/components/generic-table/generic-table.component";
import { MatChipsModule } from "@angular/material/chips";
import { ModificationRequestService } from '../../../../core/Services/api/ModificationRequest/modification-request.service';
import { CommonModule } from '@angular/common';
import { MatButton, MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatDialog } from '@angular/material/dialog';
import { RequestDetailsComponent } from '../request-details/request-details.component';

@Component({
  selector: 'app-modification-request',
  imports: [GenericTableComponent, MatChipsModule, CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './modification-request.component.html',
  styleUrl: './modification-request.component.css'
})
export class ModificationRequestComponent {
  constructor(
    private apiService: ModificationRequestService,
    private dialog: MatDialog
  ) { }

  displayedColumns: string[] = ['userName', 'fieldName', 'reasonName', 'statusName', 'actions'];

  // Configuración de columnas
  columns = [
    { key: 'userName', label: 'Persona' },
    { key: 'fieldName', label: 'Campo' },
    { key: 'reasonName', label: 'Motivo' },
    { key: 'statusName', label: 'Estado' }

  ];
  records: any[] = [];
  importBatchId!: number;

  ngOnInit(): void {
    this.getModificationsRequest();
  }

  getModificationsRequest() {
    this.apiService.ObtenerTodo(`ModificationRequest`).subscribe((data) => {
      this.records = data.data as any[];
    });
  }

  /// <summary>
  /// Retorna la clase CSS adecuada según el estado.
  /// </summary>
  getStatusClass(status: string): string {
    const normalized = status?.toLowerCase()?.trim();

    if (normalized === "aprobado") return "status-approved";
    if (normalized === "rechazado" || normalized === "fallido") return "status-rejected";
    if (normalized === "pendiente") return "status-pending";

    return "status-default";
  }

  /// <summary>
  /// Retorna el icono Material según el estado.
  /// </summary>
  getStatusIcon(status: string): string {
    const normalized = status?.toLowerCase()?.trim();

    if (normalized === "aprobado") return "check_circle";
    if (normalized === "rechazado" || normalized === "fallido") return "cancel";
    if (normalized === "pendiente") return "hourglass_empty";

    return "info";
  }

  openDetails(item: any): void {
    this.dialog.open(RequestDetailsComponent, {
      width: '500px',
      data: item,
    }).afterClosed().subscribe(result => {
      if (result) {
        this.getModificationsRequest();
      }
    });
  }
}
