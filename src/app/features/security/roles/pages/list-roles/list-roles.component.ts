import { Component, OnInit, signal } from '@angular/core';
import { GenericTableComponent } from "../../../../../shared/components/generic-table/generic-table.component";
import { ApiService } from '../../../../../core/Services/api/api.service';
import { Role } from '../../../../../core/Models/security/role.models';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { GenericFormComponent } from '../../../../../shared/components/generic-form/generic-form.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Permission } from '../../../../../core/Models/security/permission.models';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SnackbarService } from '../../../../../core/Services/snackbar/snackbar.service';
import { FormRoleFormPermissionComponent } from '../../Components/form-role-form-permission/form-role-form-permission.component';

@Component({
  selector: 'app-list-roles',
  imports: [
    CommonModule,
    GenericTableComponent,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatSnackBarModule,
],
  templateUrl: './list-roles.component.html',
  styleUrl: './list-roles.component.css'
})
export class ListRolesComponent implements OnInit {
  listRoles!: Role[];
  displayedColumns: string[] = ['name', 'description', 'isDeleted', 'actions'];


  constructor(private apiService: ApiService<Role, Role>,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private snackbarService: SnackbarService

  ) { }

  ngOnInit(): void {
    this.cargarData();
  }

  cargarData() {
    this.apiService.ObtenerTodo('Rol').subscribe((data) => {
      this.listRoles = data.data as Role[];
    })
  }


  save(item?: Role) {
    this.openModal(item)
  }

  delete(item: any) {
    this.apiService.delete("Rol", item.id).subscribe(() => {
      this.snackbarService.showInfo('Rol eliminado con éxito')
      this.cargarData();
    })
  }


  toggleIsActive(item: any) {
    this.apiService.deleteLogic('Rol', item.id).subscribe(() => {
      this.snackbarService.showSuccess("Estado actualizado con éxito");
    })
  }

  openModal(item?: Role) {
    const dialogRef = this.dialog.open(GenericFormComponent, {
      disableClose: true,
      width: '400px',
      data: {
        title: item ? 'Editar' : 'Crear',
        item
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


  add(rol: Role, id?: number) {
    if (id) {
      this.apiService.update('Rol', rol).subscribe((data) => {
        this.cargarData();
        this.snackbarService.showSuccess('Registro guardado exitosamente');
      })
    }
    else {
      this.apiService.Crear('Rol', rol).subscribe(() => {
        this.cargarData();
        this.snackbarService.showSuccess();
      })
    }
  }

  verPermisos(rol: any) {
    console.log('Permisos del rol:', rol);
    const dialogRef = this.dialog.open(FormRoleFormPermissionComponent, {
      disableClose: true,
      width: '1200px',
      data: {
        title:  'Editar',
      }
    });
  }

}
