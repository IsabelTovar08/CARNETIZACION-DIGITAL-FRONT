import { Component, ChangeDetectionStrategy, ViewEncapsulation, OnInit, signal } from '@angular/core';
import { GenericTableComponent } from "../../../../../shared/components/generic-table/generic-table.component";
import { ApiService } from '../../../../../core/Services/api/api.service';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { UserCreate, UserList } from '../../../../../core/Models/security/user.models';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarService } from '../../../../../core/Services/snackbar/snackbar.service';
import { GenericFormComponent } from '../../../../../shared/components/generic-form/generic-form.component';

@Component({
  selector: 'app-list-users',
  imports: [
    CommonModule,
    GenericTableComponent,
    MatChipsModule
  ],
  templateUrl: './list-users.component.html',
  styleUrl: './list-users.component.css',
  encapsulation: ViewEncapsulation.None
})
export class ListUsersComponent implements OnInit {
  listUser$!: Observable<UserCreate[]>;
  displayedColumns: string[] = ['namePerson', 'email', 'roles', 'isDeleted', 'actions'];

  constructor(private apiService: ApiService<UserCreate, UserList>,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private snackbarService: SnackbarService
  ) { }

  ngOnInit(): void {
    this.cargarData()
  }

  cargarData() {
    this.listUser$ = this.apiService.ObtenerTodo('User')
  }

  openModal(item?: UserCreate) {
    const dialogRef = this.dialog.open(GenericFormComponent, {
      disableClose: true,
      width: '400px',
      data: {
        title: item ? 'Editar' : 'Crear',
        item,
        fields: [
          { name: 'password', label: 'Contraseña', type: 'password', value: item?.password || '', required: true },
          { name: 'password', label: 'Contraseña', type: 'password', value: item?.password || '', required: true }

        ],
        replaceBaseFields: true
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


  add(Form: UserCreate, id?: number) {
    if (id) {
      this.apiService.update('User', Form).subscribe(() => {
        this.cargarData();
        this.snackbarService.showSuccess();
      })
    }
    else {
      this.apiService.Crear('User', Form).subscribe(() => {
        this.cargarData();
        this.snackbarService.showSuccess();
      })
    }
  }

  save(data?: UserCreate) {
    this.openModal(data)
  }

  delete(item: any) {
    this.apiService.delete("Form", item.id).subscribe(() => {
      this.snackbarService.showInfo('Formulario eliminado con éxito')
      this.cargarData();
    })
  }
  toggleIsActive(item: any) { }

}
