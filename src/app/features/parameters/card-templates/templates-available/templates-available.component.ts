import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';

import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatFormFieldModule } from "@angular/material/form-field";
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardsService } from '../../../../core/Services/api/card/cards.service';
import { SnackbarService } from '../../../../core/Services/snackbar/snackbar.service';
import { MatInputModule } from '@angular/material/input';

import { TemplateModalComponent } from '../template-modal/template-modal.component';
import { CardConfigurationsComponent } from "../../card-configurations/card-configurations.component";

@Component({
  selector: 'app-templates-available',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    CardConfigurationsComponent
],
  templateUrl: './templates-available.component.html',
  styleUrl: './templates-available.component.css'
})
export class TemplatesAvailableComponent implements OnInit {

  private srv = inject(CardsService);
  private snackbar = inject(SnackbarService);
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);

  templates = signal<any[]>([]);

  ngOnInit(): void {
    this.loadTemplates();
  }

  // ===========================================================
  // CARGAR LISTA
  // ===========================================================
  loadTemplates() {
    this.srv.ObtenerTodo('CardTemplate').subscribe({
      next: (res) => this.templates.set(res.data ?? []),
      error: () => this.snackbar.showError('Error cargando plantillas')
    });
  }

  // ===========================================================
  // ABRIR MODAL PARA CREAR
  // ===========================================================
  openCreate() {
    const dialogRef = this.dialog.open(TemplateModalComponent, {
      width: '580px',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      if (result.mode === 'create') this.save(result.data);
    });
  }

  // ===========================================================
  // ABRIR MODAL PARA EDITAR
  // ===========================================================
  openEdit(t: any) {
    const dialogRef = this.dialog.open(TemplateModalComponent, {
      width: '70vw',
    height: '60vh',

      data: { template: t }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      if (result.mode === 'edit') this.update(result.id, result.data);
    });
  }

  // ===========================================================
  // GUARDAR DESDE EL MODAL
  // ===========================================================
  save(data: any) {
    const fd = new FormData();
    fd.append('name', data.name);

    if (data.frontSvg) fd.append('FrontFile', data.frontSvg);
    if (data.backSvg) fd.append('BackFile', data.backSvg);

    this.srv.Crear('CardTemplate', fd).subscribe({
      next: () => {
        this.snackbar.showSuccess('Plantilla creada');
        this.loadTemplates();
      },
      error: () => this.snackbar.showError('Error al crear plantilla')
    });
  }

  // ===========================================================
  // ACTUALIZAR DESDE EL MODAL
  // ===========================================================
  update(id: number, data: any) {
    const fd = new FormData();
    fd.append('id', id.toString());
    fd.append('name', data.name);

    if (data.frontSvg) fd.append('FrontFile', data.frontSvg);
    if (data.backSvg) fd.append('BackFile', data.backSvg);

    this.srv.ActualizarWithImage('CardTemplate', fd).subscribe({
      next: () => {
        this.snackbar.showSuccess('Plantilla actualizada');
        this.loadTemplates();
      },
      error: () => this.snackbar.showError('Error al actualizar')
    });
  }

  // ===========================================================
  // ACTIVAR / DESACTIVAR PLANTILLA
  // ===========================================================
  toggle(t: any) {
    this.srv.deleteLogic('CardTemplate', t.id).subscribe({
      next: () => {
        this.snackbar.showSuccess('Estado actualizado');
        this.loadTemplates();
      },
      error: () => this.snackbar.showError('Error al actualizar estado')
    });
  }

  openModal(template: any = null) {
  const dialogRef = this.dialog.open(TemplateModalComponent, {
    width: '600px',
    height: 'auto',
    data: { template }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (!result) return;

    if (result.mode === 'create') this.save(result.data);
    else if (result.mode === 'edit') this.update(result.id, result.data);
  });
}

}
