import { Component, OnInit, signal } from '@angular/core';
import { GenericTableComponent } from "../../../../../shared/components/generic-table/generic-table.component";
import { ApiService } from '../../../../../core/Services/api/api.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { GenericFormComponent } from '../../../../../shared/components/generic-form/generic-form.component';
import { Permission } from '../../../../../core/Models/security/permission.models';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SnackbarService } from '../../../../../core/Services/snackbar/snackbar.service';

@Component({
  selector: 'app-list-permissions',
  imports: [
    CommonModule,
    GenericTableComponent],
  templateUrl: './list-permissions.component.html',
  styleUrl: './list-permissions.component.css'
})
export class ListPermissionsComponent implements OnInit {
  listPermission$!: Observable<Permission[]>;
  displayedColumns: string[] = ['name', 'description', 'isDeleted', 'actions'];

  constructor(private apiService: ApiService<Permission, Permission>,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private snackbarService: SnackbarService
  ) { }

  ngOnInit(): void {
    this.cargarData();
    this.route.url.subscribe(segments => {
      const isCreate = segments.some(s => s.path === 'create');
      if (isCreate) {
        this.openModal();
      }
    });
  }

  cargarData() {
    this.listPermission$ = this.apiService.ObtenerTodo('Permission')
  }

  openModal(item?: Permission) {
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


  add(permission: Permission, id?: number) {
    if (id) {
      this.apiService.update('Permission', permission).subscribe(() => {
        this.cargarData();
        this.snackbarService.showSuccess();
      })
    }
    else {
      this.apiService.Crear('Permission', permission).subscribe(() => {
        this.cargarData();
        this.snackbarService.showSuccess();
      })
    }
  }

  save(data?: Permission) {
    this.openModal(data)
  }

  delete(item: any) {
    this.apiService.delete("Permission", item.id).subscribe(() => {
      this.snackbarService.showInfo('Permiso eliminado con éxito')
      this.cargarData();
    })
  }

  toggleIsActive(item: any) { }
}
