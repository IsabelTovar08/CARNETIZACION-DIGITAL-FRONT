import { Component, OnInit } from '@angular/core';
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { GenericListCardComponent } from "../../../../../../shared/components/generic-list-card/generic-list-card.component";
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../../../../core/Services/api/api.service';
import { SnackbarService } from '../../../../../../core/Services/snackbar/snackbar.service';
import { BranchService } from '../../../../../../core/Services/api/organizational/branch/branch.service';
import { GenericFormComponent } from '../../../../../../shared/components/generic-form/generic-form.component';

import { Branch } from '../../../../../../core/Models/organization/organizationalUnit.models';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-branches',
  imports: [MatIconModule, MatMenuModule, GenericListCardComponent, MatButtonModule],
  templateUrl: './list-branches.component.html',
  styleUrl: './list-branches.component.css'
})
export class ListBranchesComponent implements OnInit {
  // Igual que en Events: el dataSource que se pasa ya mapeado a card items
  listBranches: any[] = [];

  constructor(
    private apiService: ApiService<Branch, Branch>,
    private branchService: BranchService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
  ) {}

  ngOnInit(): void {
    this.branchService.ObtenerTodo('Branch').subscribe((resp) => {
      const data = (resp?.data ?? []) as Branch[];
      this.listBranches = data.map(this.toCardItem);
      console.log(this.listBranches);
    });
  }

  private toCardItem = (e: Branch): any => {
    const { id, name, ...rest } = e;

    return {
      ...rest,
      id,
      title: name ?? 'Sucursal',
      subtitle: 'Sucursal activa',
      tags: [],
      imageUrl: 'https://www.anahuac.mx/mexico/sites/default/files/styles/webp/public/noticias/Empresas-mas-innovadores-en-el-mundo.jpg.webp?itok=jy4fPHsa',
      isDeleted: false,
    };
  };

  create() {
    const dialogRef = this.dialog.open(GenericFormComponent, {
      disableClose: true,
      width: '500px',
      data: {
        title: 'Crear Sucursal',
        fields: [
          {
            name: 'name',
            label: 'Nombre',
            type: 'text',
            value: '',
            required: true
          }
        ],
        replaceBaseFields: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const branchData: Branch = {
          id: 0,
          name: result.name
        };

        this.branchService.Crear('Branch', branchData).subscribe({
          next: () => {
            this.snackbarService.showSuccess('Sucursal creada exitosamente');
            this.ngOnInit(); // Recargar lista
          },
          error: (err: any) => {
            this.snackbarService.showError('Error al crear sucursal');
            console.error(err);
          }
        });
      }
    });
  }

  view(e: any): void {
    // Implementar vista de detalle si es necesario
  }

  edit(e: any) {
    const dialogRef = this.dialog.open(GenericFormComponent, {
      disableClose: true,
      width: '500px',
      data: {
        title: 'Editar Sucursal',
        item: e,
        fields: [
          {
            name: 'name',
            label: 'Nombre',
            type: 'text',
            value: e.name || '',
            required: true
          }
        ],
        replaceBaseFields: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const branchData: Branch = {
          id: e.id,
          name: result.name
        };

        this.branchService.update('Branch', branchData).subscribe({
          next: () => {
            this.snackbarService.showSuccess('Sucursal actualizada exitosamente');
            this.ngOnInit(); // Recargar lista
          },
          error: (err: any) => {
            this.snackbarService.showError('Error al actualizar sucursal');
            console.error(err);
          }
        });
      }
    });
  }

  remove(e: any) {
    Swal.fire({
      title: '¿Eliminar sucursal?',
      text: `¿Estás seguro de eliminar "${e.title}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.branchService.deleteLogic('Branch', e.id).subscribe({
          next: () => {
            this.snackbarService.showSuccess('Sucursal eliminada');
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
      title: `¿${actionText} sucursal?`,
      text: `¿Estás seguro de ${action} "${e.title}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: e.isDeleted ? '#28a745' : '#ffc107',
      cancelButtonColor: '#6c757d',
      confirmButtonText: `Sí, ${action}`,
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.branchService.deleteLogic('Branch', e.id).subscribe({
          next: () => {
            this.snackbarService.showSuccess(`Sucursal ${action === 'activar' ? 'activada' : 'desactivada'}`);
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