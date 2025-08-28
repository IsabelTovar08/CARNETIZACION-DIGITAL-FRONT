import { LoangingServiceService } from './../../../../../core/Services/loanding/loanging-service.service';
import { Component, OnInit, signal } from '@angular/core';
import { GenericTableComponent } from "../../../../../shared/components/generic-table/generic-table.component";
import { ApiService } from '../../../../../core/Services/api/api.service';
import { Module } from '../../../../../core/Models/security/module.models';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarService } from '../../../../../core/Services/snackbar/snackbar.service';
import { GenericFormComponent } from '../../../../../shared/components/generic-form/generic-form.component';
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: 'app-list-modules',
  imports: [
    CommonModule,
    GenericTableComponent,
    MatProgressSpinnerModule,
    MatIconModule
],
  templateUrl: './list-modules.component.html',
  styleUrl: './list-modules.component.css'
})
export class ListModulesComponent implements OnInit {
  listModule!: Module[];
  displayedColumns: string[] = ['icon', 'name', 'description', 'isDeleted', 'actions'];


  constructor(
    private apiService: ApiService<Module, Module>,
    public loadingService: LoangingServiceService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private snackbarService: SnackbarService

  ) { }

  ngOnInit(): void {
    this.cargarData();
  }


  cargarData() {
    this.apiService.ObtenerTodo('Module').subscribe((data) => {
      this.listModule = data.data as Module[];
    })
  }

  openModal(item?: Module) {
    const dialogRef = this.dialog.open(GenericFormComponent, {
      disableClose: true,
      width: '400px',
      data: {
        title: item ? 'Editar' : 'Crear',
        item,
         fields: [
            { name: 'icon', label: 'Icono', type: 'string', value: item?.icon || '', required: true },
          ],
          replaceBaseFields: false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (item) {
          this.add(result, item.id);
        } else {
          this.add(result);
        }
      }

      // 🔙 Vuelve a la ruta base sin /create
      this.router.navigate(['./'], { relativeTo: this.route });
    });
  }


  add(Module: Module, id?: number) {
    if (id) {
      this.apiService.update('Module', Module).subscribe(() => {
        this.cargarData();
        this.snackbarService.showSuccess();
      })
    }
    else {
      this.apiService.Crear('Module', Module).subscribe(() => {
        this.cargarData();
        this.snackbarService.showSuccess();
      })
    }
  }

  save(data?: Module) {
    this.openModal(data)
  }

  delete(item: any) {
    this.apiService.delete("Module", item.id).subscribe(() => {
      this.snackbarService.showInfo('Modulo eliminado con éxito')
      this.cargarData();
    })
  }

  toggleIsActive(item: any) {
    this.apiService.deleteLogic('Module', item.id).subscribe(() => {
      this.snackbarService.showSuccess("Estado actualizado con éxito");
    })
   }
}
