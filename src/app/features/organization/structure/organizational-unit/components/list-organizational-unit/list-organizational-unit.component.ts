import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { GenericListCardComponent } from "../../../../../../shared/components/generic-list-card/generic-list-card.component";
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../../../../core/Services/api/api.service';
import { SnackbarService } from '../../../../../../core/Services/snackbar/snackbar.service';
import { OrganizationalUnitService } from '../../../../../../core/Services/api/organizational/organization-unit/organization-unit.service';
import { GenericFormComponent } from '../../../../../../shared/components/generic-form/generic-form.component';
import { DetailOrganizationalUnitComponent } from '../detail-organizational-unit/detail-organizational-unit.component';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';

import { OrganizationalUnitCreate, OrganizationalUnitList, Branch, OrganizationalUnitWithBranchesCreate } from '../../../../../../core/Models/organization/organizationalUnit.models';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-organizational-unit',
  imports: [MatIconModule, MatMenuModule, GenericListCardComponent, MatButtonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, CommonModule, MatDialogModule],
  templateUrl: './list-organizational-unit.component.html',
  styleUrl: './list-organizational-unit.component.css'
})
export class ListOrganizationalUnitComponent implements OnInit {
  // Igual que en Events: el dataSource que se pasa ya mapeado a card items
  listUnits: any[] = [];
  branches: Branch[] = [];
  organizationalUnitForm: FormGroup;

  @ViewChild('createFormDialog') createFormDialog!: TemplateRef<any>;

  constructor(
    private apiService: ApiService<OrganizationalUnitCreate, OrganizationalUnitList>,
    private organizationalUnitService: OrganizationalUnitService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private fb: FormBuilder,
  ) {
    this.organizationalUnitForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      code: ['', Validators.required],
      branchIds: [[], Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadBranches();
    this.organizationalUnitService.ObtenerTodo('OrganizationalUnit').subscribe((resp) => {
      const data = (resp?.data ?? []) as OrganizationalUnitList[];
      this.listUnits = data.map(this.toCardItem);
      console.log(this.listUnits);
    });
  }

  private loadBranches(): void {
    this.organizationalUnitService.getActiveBranches().subscribe({
      next: (resp) => {
        this.branches = (resp?.data ?? []) as Branch[];
      },
      error: (err) => {
        this.snackbarService.showError('Error al cargar las sedes');
        console.error(err);
      }
    });
  }

  private toCardItem = (e: OrganizationalUnitList): any => {
    const { id, name, description, isDeleted, ...rest } = e;

    return {
      ...rest,
      id,
      title: name ?? 'Unidad Organizativa',
      subtitle: description ?? 'Sin descripción.',
      tags: isDeleted ? ['Inactivo'] : [],
      imageUrl: 'https://www.anahuac.mx/mexico/sites/default/files/styles/webp/public/noticias/Empresas-mas-innovadores-en-el-mundo.jpg.webp?itok=jy4fPHsa',
      isDeleted: !!isDeleted,
    };
  };

  create() {
    const dialogRef = this.dialog.open(this.createFormDialog, {
      disableClose: true,
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onSubmit();
      }
    });
  }

  onSubmit(): void {
    if (this.organizationalUnitForm.valid) {
      const formValue = this.organizationalUnitForm.value;
      const now = new Date().toISOString();

      const data: OrganizationalUnitWithBranchesCreate = {
        unit: {
          id: 0,
          name: formValue.name,
          description: formValue.description
        },
        branchIds: formValue.branchIds
      };

      this.organizationalUnitService.createWithBranches(data).subscribe({
        next: () => {
          this.snackbarService.showSuccess('Unidad organizativa creada exitosamente');
          this.organizationalUnitForm.reset();
          this.ngOnInit(); // Recargar lista
        },
        error: (err: any) => {
          this.snackbarService.showError('Error al crear unidad organizativa');
          console.error(err);
        }
      });
    }
  }

  view(e: any): void {
    // Abrir modal con detalle de la unidad organizativa
    const dialogRef = this.dialog.open(DetailOrganizationalUnitComponent, {
      disableClose: false,
      width: '90vw',
      maxWidth: '1000px',
      maxHeight: '90vh',
      data: { unitId: e.id }
    });
  }

  edit(e: any) {
    const dialogRef = this.dialog.open(GenericFormComponent, {
      disableClose: true,
      width: '500px',
      data: {
        title: 'Editar Unidad Organizativa',
        item: e,
        fields: [
          {
            name: 'name',
            label: 'Nombre',
            type: 'text',
            value: e.name || '',
            required: true
          },
          {
            name: 'description',
            label: 'Descripción',
            type: 'textarea',
            value: e.description || '',
            required: false
          }
        ],
        replaceBaseFields: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const organizationalUnitData: OrganizationalUnitCreate = {
          id: e.id,
          name: result.name,
          description: result.description || '',
          isDeleted: e.isDeleted || false
        };

        this.organizationalUnitService.update('OrganizationalUnit', organizationalUnitData).subscribe({
          next: () => {
            this.snackbarService.showSuccess('Unidad organizativa actualizada exitosamente');
            this.ngOnInit(); // Recargar lista
          },
          error: (err: any) => {
            this.snackbarService.showError('Error al actualizar unidad organizativa');
            console.error(err);
          }
        });
      }
    });
  }

  remove(e: any) {
    Swal.fire({
      title: '¿Eliminar unidad organizativa?',
      text: `¿Estás seguro de eliminar "${e.title}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.organizationalUnitService.deleteLogic('OrganizationalUnit', e.id).subscribe({
          next: () => {
            this.snackbarService.showSuccess('Unidad organizativa eliminada');
            this.ngOnInit(); // Recargar lista
          },
          error: (err: any) => {
            this.snackbarService.showError('Error al eliminar');
            console.error(err);
          }
        });
      }
    });
  }

  toggle(e: any) {
    const action = e.isDeleted ? 'activar' : 'desactivar';
    const actionText = e.isDeleted ? 'Activar' : 'Desactivar';

    Swal.fire({
      title: `¿${actionText} unidad organizativa?`,
      text: `¿Estás seguro de ${action} "${e.title}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: e.isDeleted ? '#28a745' : '#ffc107',
      cancelButtonColor: '#6c757d',
      confirmButtonText: `Sí, ${action}`,
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.organizationalUnitService.deleteLogic('OrganizationalUnit', e.id).subscribe({
          next: () => {
            this.snackbarService.showSuccess(`Unidad organizativa ${action === 'activar' ? 'activada' : 'desactivada'}`);
            this.ngOnInit(); // Recargar lista
          },
          error: (err: any) => {
            this.snackbarService.showError(`Error al ${action}`);
            console.error(err);
          }
        });
      }
    });
  }
}
