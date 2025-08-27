import { Component } from '@angular/core';
import { MatCardModule } from "@angular/material/card";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatDividerModule } from "@angular/material/divider";
import { MatInputModule } from "@angular/material/input";
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { ApiService } from '../../../../../core/Services/api/api.service';
import { FromModel } from '../../../../../core/Models/security/form.models';
import { ModalPermissionsComponent } from '../modal-permissions/modal-permissions.component';
import { Module } from '../../../../../core/Models/security/module.models';
import { RouterLink } from '@angular/router';
import { RolFormPermissionsList } from '../../../../../core/Models/security/rol-form-permission.models';
import { RolFormPermissionService } from '../../../../../core/Services/api/rol-form-permission/rol-form-permission.service';
import { DataService } from '../../../../../core/Services/shared/data.service';
import { Role } from '../../../../../core/Models/security/role.models';
import { Permission } from '../../../../../core/Models/security/permission.models';
import { SnackbarService } from '../../../../../core/Services/snackbar/snackbar.service';


@Component({
  selector: 'app-form-role-form-permission',
  imports: [MatCardModule,
    RouterLink,
    MatButtonModule,
    CommonModule,
    MatChipsModule,
    MatIconModule,
    FormsModule,
    MatTooltipModule,
    MatButtonToggleModule,
    MatProgressSpinnerModule, MatMenuModule, MatDividerModule, MatInputModule,
  ],
  templateUrl: './form-role-form-permission.component.html',
  styleUrl: './form-role-form-permission.component.css'
})
export class FormRoleFormPermissionComponent {
  // Estados del componente
  isLoading = false;
  loadingMessage = 'Cargando permisos...';
  hasChanges = false;
  searchTerm = '';

  // Control de estado
  currentForm: FromModel | null = null;
  // originalPermissions: RolePermissions[] = [];
  listRoles!: Role[];
  listForm!: FromModel[];
  listModule!: Module[];
  listPermissions!: Permission[];

  listRolFormPermission!: RolFormPermissionsList[];
  permissionMap: Record<string, RolFormPermissionsList> = {};
  selectedFilter: number | null = null;


  constructor
  (
    private dialog: MatDialog,
    private dataService: DataService,
    private snackbarService : SnackbarService
  ) {}

  ngOnInit(): void {
    this.initializeData();
  }

  // Inicialización de datos mock
  private initializeData(): void {

    this.dataService.roleFormPermissions$.subscribe(data => {
      this.listRolFormPermission = data || [];
      this.buildPermissionMap();
    });
    this.dataService.getRoleFormPermissions();

    this.dataService.modules$.subscribe(data => this.listModule = data);
    this.dataService.getModules();

    this.dataService.forms$.subscribe(data => this.listForm = data);
    this.dataService.getForms();

    this.dataService.roles$.subscribe(data => this.listRoles = data);
    this.dataService.getRoles();

    this.dataService.permissions$.subscribe(data => this.listPermissions = data);
    this.dataService.getPermissions();


  }
  private buildPermissionMap() {
    this.permissionMap = this.listRolFormPermission.reduce((map, item) => {
      map[`${item.rolId}_${item.formId}`] = item;
      return map;
    }, {} as Record<string, RolFormPermissionsList>);
  }

  getPermission(roleId: number, formId: number) {
    return this.permissionMap[`${roleId}_${formId}`] || null;
  }

  get filteredForms() {
    if (!this.selectedFilter) return this.listForm;
    return this.listForm.filter(form => form.moduleId === this.selectedFilter);
  }

  // Métodos de cambios
  hasPermissionChanges(roleId: number, formId: number) {
  }

  // Acciones rápidas
  quickGrantPermission(role: Role, form: FromModel, permissions: Permission[]): void {
    const selectedPermissionIds = permissions.map(p => p.id);

    const dialogRef = this.dialog.open(ModalPermissionsComponent, {
      width: '500px',
      data: {
        role: role,
        form: form,
        selectedPermissionIds: selectedPermissionIds
      }
    });
      dialogRef.afterClosed().subscribe(result => {
    if (result === true) {
      // Aquí recargas la lista porque el modal cerró con éxito
      this.snackbarService.showSuccess("Permisos asignados exitosamente.")
      this.initializeData();
    }
  });
  }


  quickRevokePermission(roleId: number, formId: number, event: Event): void {
    event.stopPropagation();

  }

  // Métodos de diálogo y UI
  openPermissionDialog(role: Role, form: FromModel): void {
    // Aquí abrirías un diálogo detallado para editar permisos
    console.log('Abrir diálogo para:', role.name, '-', form.name);
  }

  setCurrentForm(form: FromModel): void {
    this.currentForm = form;
  }

  getPriorityLabel(priority: string): string {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Media';
      case 'low': return 'Baja';
      default: return 'N/A';
    }
  }

}
