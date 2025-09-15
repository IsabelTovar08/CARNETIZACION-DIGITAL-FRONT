import { UserRolesService } from '../../../../../core/Services/api/user-role/user-roles.service';
import { PersonList } from './../../../../../core/Models/security/person.models';
import { Component, ChangeDetectionStrategy, ViewEncapsulation, OnInit, signal } from '@angular/core';
import { GenericTableComponent } from "../../../../../shared/components/generic-table/generic-table.component";
import { ApiService } from '../../../../../core/Services/api/api.service';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { UserCreate, UserList } from '../../../../../core/Models/security/user.models';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SnackbarService } from '../../../../../core/Services/snackbar/snackbar.service';
import { GenericFormComponent } from '../../../../../shared/components/generic-form/generic-form.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatCardModule } from "@angular/material/card";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatDividerModule } from "@angular/material/divider";
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PersonCreate } from '../../../../../core/Models/security/person.models';
import { TargetPersonComponent } from '../../../people/components/target-person/target-person.component';
import { DataService } from '../../../../../core/Services/shared/data.service';
import { ModalUserRolesComponent } from '../../../roles/Components/modal-user-roles/modal-user-roles.component';
import { UserRolCreate, UserRolCreateAll, UserRolList } from '../../../../../core/Models/security/user-roles.models';
import { Role } from '../../../../../core/Models/security/role.models';


@Component({
  selector: 'app-list-users',
  imports: [
    CommonModule,
    GenericTableComponent,
    MatChipsModule,
    MatIconModule,
    MatMenuModule,
    MatCardModule,
    MatButtonToggleModule,
    MatInputModule,
    MatSelectModule,
    MatDividerModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatTooltipModule,
    RouterLink
  ],
  templateUrl: './list-users.component.html',
  styleUrl: './list-users.component.css',
  encapsulation: ViewEncapsulation.None
})
export class ListUsersComponent implements OnInit {
  listUsers!: UserList[];
  displayedColumns: string[] = ['namePerson', 'emailPerson', 'role', 'isDeleted', 'actions'];
  itemu: any
  listRoles: Role[] = [];

  //  displayedColumns: string[] = ['user', 'department', 'status', 'roles', 'actions']

  constructor(private apiService: ApiService<UserCreate, UserList>,
    private personService: ApiService<PersonCreate, PersonList>,
    private userRolesService: UserRolesService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.cargarData()

  }

  cargarData() {
    this.dataService.usuarios$.subscribe(data => this.listUsers = data);
    // Carga inicial de los datos dinámicos
    this.dataService.getUsers();

    this.dataService.roles$.subscribe(data => this.listRoles = data);
    this.dataService.getRoles();
  }
  openModal(user: UserList) {
    this.personService.ObtenerPorId('Person', user.personId).subscribe((response) => {
      let item = response.data;
      this.dialog.open(TargetPersonComponent, {
        disableClose: true,
        width: '800px',
        maxHeight: '80vh',
        data: {
          title: item ? 'Editar' : 'Crear',
          item
        }
      });

      console.log('Datos cargados:', item);
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
  }

  delete(item: any) {
    this.apiService.delete("Form", item.id).subscribe(() => {
      this.snackbarService.showInfo('Formulario eliminado con éxito')
      this.cargarData();
    })
  }
  toggleIsActive(item: any) {
    this.apiService.deleteLogic('User', item.id).subscribe(() => {
      this.snackbarService.showSuccess("Estado actualizado con éxito");
    })
  }


  openUserRolesModal(user: UserList | any) {
    const fields = [
      // Campo oculto con el id del usuario
      { name: 'id', value: user.id || 0, hidden: true },

      // Campo de solo lectura para mostrar el nombre
      { name: 'name', label: 'Nombre Usuario', type: 'text', value: user.namePerson || '', readonly: true },

      // Roles como checkboxes
      ...this.listRoles.map(role => ({
        name: 'role_' + role.id,
        label: role.name,
        type: 'checkbox',
        value: user.roles.some((r: any )=> r.id === role.id) // <-- aquí se marca si ya tiene ese rol
      }))
    ];


    const dialogRef = this.dialog.open(GenericFormComponent, {
      width: '400px',
      disableClose: true,
      data: {
        title: 'Roles para usuario',
        item: user,
        fields,
        replaceBaseFields: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const selectedRoleIds = Object.entries(result)
          .filter(([key, checked]) => checked && key.startsWith('role_'))
          .map(([key]) => parseInt(key.replace('role_', ''), 10));

        const data: UserRolCreateAll = {
          userId: user.id,
          rolesId: selectedRoleIds,
        };

        this.userRolesService.saveAllRoles(data).subscribe(() => {
          this.snackbarService.showSuccess();
          this.cargarData();
        });
      }
    });
  }


  viewMode: 'grid' | 'list' = 'grid';


  changeViewMode(event: any): void {
    this.viewMode = event.value;
  }

  savePerson(){
    this.router.navigate(['createUser'], { relativeTo: this.route });
  }
}
