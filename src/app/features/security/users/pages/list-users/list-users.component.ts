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
export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  department: string;
  status: 'active' | 'inactive';
  roles: Role[];
}

export interface Role {
  id: number;
  name: string;
  description: string;
  color: string;
  permissions: number;
}
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
    MatTooltipModule
],
  templateUrl: './list-users.component.html',
  styleUrl: './list-users.component.css',
  encapsulation: ViewEncapsulation.None
})
export class ListUsersComponent implements OnInit {
  listUser$!: Observable<UserList[]>;
  displayedColumns: string[] = ['namePerson', 'email', 'roles', 'isDeleted', 'actions'];
  //  displayedColumns: string[] = ['user', 'department', 'status', 'roles', 'actions']

  constructor(private apiService: ApiService<UserCreate, UserList>,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private snackbarService: SnackbarService
  ) { }

  ngOnInit(): void {
    this.cargarData()
    this.dataSource.data = this.mockUsers;

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


   searchControl = new FormControl('');
  departmentFilter = new FormControl('');
  statusFilter = new FormControl('');
  roleFilter = new FormControl('');

  viewMode: 'grid' | 'list' = 'grid';

  dataSource = new MatTableDataSource<User>();

  availableRoles: Role[] = [
    { id: 1, name: 'Super Admin', description: 'Acceso completo', color: '#f44336', permissions: 15 },
    { id: 2, name: 'Administrador', description: 'Gestión general', color: '#ff9800', permissions: 12 },
    { id: 3, name: 'Manager', description: 'Gestión de equipo', color: '#2196f3', permissions: 8 },
    { id: 4, name: 'Editor', description: 'Edición de contenido', color: '#4caf50', permissions: 5 },
    { id: 5, name: 'Viewer', description: 'Solo lectura', color: '#9c27b0', permissions: 2 }
  ];

  mockUsers: User[] = [
    {
      id: 1,
      name: 'Ana García',
      email: 'ana.garcia@company.com',
      department: 'IT',
      status: 'active',
      roles: [
        { id: 1, name: 'Super Admin', description: 'Acceso completo', color: '#f44336', permissions: 15 },
        { id: 2, name: 'Administrador', description: 'Gestión general', color: '#ff9800', permissions: 12 }
      ]
    },
    {
      id: 2,
      name: 'Carlos Rodríguez',
      email: 'carlos.rodriguez@company.com',
      department: 'HR',
      status: 'active',
      roles: [
        { id: 3, name: 'Manager', description: 'Gestión de equipo', color: '#2196f3', permissions: 8 }
      ]
    },
    {
      id: 3,
      name: 'María López',
      email: 'maria.lopez@company.com',
      department: 'Finance',
      status: 'inactive',
      roles: [
        { id: 4, name: 'Editor', description: 'Edición de contenido', color: '#4caf50', permissions: 5 },
        { id: 5, name: 'Viewer', description: 'Solo lectura', color: '#9c27b0', permissions: 2 }
      ]
    },
    {
      id: 4,
      name: 'Juan Martínez',
      email: 'juan.martinez@company.com',
      department: 'Marketing',
      status: 'active',
      roles: []
    },
    {
      id: 5,
      name: 'Laura Sánchez',
      email: 'laura.sanchez@company.com',
      department: 'IT',
      status: 'active',
      roles: [
        { id: 2, name: 'Administrador', description: 'Gestión general', color: '#ff9800', permissions: 12 },
        { id: 4, name: 'Editor', description: 'Edición de contenido', color: '#4caf50', permissions: 5 }
      ]
    }
  ];



  changeViewMode(event: any): void {
    this.viewMode = event.value;
  }
}
