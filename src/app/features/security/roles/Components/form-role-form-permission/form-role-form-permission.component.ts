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
import { Observable } from 'rxjs';
import { ApiService } from '../../../../../core/Services/api/api.service';
import { FromModel } from '../../../../../core/Models/security/form.models';
import { ModalPermissionsComponent } from '../modal-permissions/modal-permissions.component';
import { Module } from '../../../../../core/Models/security/module.models';
import { RouterLink } from '@angular/router';
import { RolFormPermissionsList } from '../../../../../core/Models/security/rol-form-permission.models';
import { RolFormPermissionService } from '../../../../../core/Services/api/rol-form-permission.service';


interface Permission {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}

// interface RolePermissions {
//   roleId: number;
//   formId: number;
//   permissions: Permission;
//   isInherited?: boolean;
//   isLocked?: boolean;
// }

interface Role {
  id: number;
  name: string;
  description: string;
  color: string;
  icon: string;
  priority: 'low' | 'medium' | 'high';
  isActive: boolean;
}

interface FormModule {
  id: number;
  name: string;
  description: string;
  icon: string;
  category: string;
  isActive: boolean;
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  timestamp: Date;
}

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
  selectedFilter = 'all';

  // Datos principales
  roles: Role[] = [];
  forms: FormModule[] = [];
  // rolePermissions: RolePermissions[] = [];
  notifications: Notification[] = [];

  // Datos filtrados
  filteredRoles: Role[] = [];
  filteredForms: FormModule[] = [];

  // Control de estado
  currentForm: FromModel | null = null;
  // originalPermissions: RolePermissions[] = [];
  listRoles$!: Observable<Role[]>;
  listForm$!: Observable<FromModel[]>;
  listModule$!: Observable<Module[]>;
  listRolFormPermission$!: Observable<RolFormPermissionsList[]>;
  RolFormPermission!: RolFormPermissionsList[];



  constructor(private dialog: MatDialog,
    private apiServiceRole: ApiService<Role, Role>,
    private apiServiceForm: ApiService<FromModel, FromModel>,
    private apiServiceModule: ApiService<Module, Module>,
    private apiServiceRolFormPermission: RolFormPermissionService,
  ) {
  }

  ngOnInit(): void {
    this.initializeData();

  }

  // Inicialización de datos mock
  private initializeData(): void {
    this.listRoles$ = this.apiServiceRole.ObtenerTodo('Rol')
    this.listForm$ = this.apiServiceForm.ObtenerTodo('Form')
    this.listModule$ = this.apiServiceForm.ObtenerTodo('Module')
    this.listRolFormPermission$ = this.apiServiceRolFormPermission.getAllPermissions()
    this.listRolFormPermission$.subscribe(data => {
      this.RolFormPermission = data;
    });

  }

  // Métodos de filtrado
  filterData(): void {
    const term = this.searchTerm.toLowerCase();

    this.filteredRoles = this.roles.filter(role =>
      role.name.toLowerCase().includes(term) ||
      role.description.toLowerCase().includes(term)
    );

    this.filteredForms = this.forms.filter(form =>
      form.name.toLowerCase().includes(term) ||
      form.description.toLowerCase().includes(term)
    );
  }





  hasSpecificPermission(roleId: number, formId: number, permission: keyof Permission) {

  }

  hasAnyPermission(roleId: number, formId: number) {

  }

  hasPartialPermission(roleId: number, formId: number) {

  }

  getPermissionClass(roleId: number, formId: number) {


  }

  getPermissionIcon(roleId: number, formId: number) {


  }

  getPermissionLabel(roleId: number, formId: number) {


  }

  // Métodos de cambios
  hasPermissionChanges(roleId: number, formId: number) {

  }

  // Acciones rápidas
  quickGrantPermission(item: any): void {

    const dialogRef = this.dialog.open(ModalPermissionsComponent, {
      width: '500px',
      data: {
        // roleName: ro.name,
        // formName: form.name,
        // permissions: this.permissions$
      }
    });
  }

  quickRevokePermission(roleId: number, formId: number, event: Event): void {
    event.stopPropagation();



  }

  // Acciones en lote
  bulkPermissionAction(action: string) {

  }

  // Métodos de control
  checkForChanges(): void {

  }

  saveAllPermissions(): void {

  }


  // Métodos de diálogo y UI
  openPermissionDialog(role: Role, form: FromModel): void {
    // Aquí abrirías un diálogo detallado para editar permisos
    console.log('Abrir diálogo para:', role.name, '-', form.name);
  }

  setCurrentForm(form: FromModel): void {
    this.currentForm = form;
  }

  grantAllForForm(): void {


    this.checkForChanges();
    this.showNotification('success', `Permisos concedidos para `);
  }

  revokeAllForForm(): void {


    this.checkForChanges();
    this.showNotification('warning', `Permisos revocados para `);
  }

  // Métodos auxiliares



  getPriorityLabel(priority: string): string {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Media';
      case 'low': return 'Baja';
      default: return 'N/A';
    }
  }

  // Métodos de notificación
  showNotification(type: 'success' | 'error' | 'warning' | 'info', message: string): void {
    const notification: Notification = {
      id: Date.now().toString(),
      type,
      message,
      timestamp: new Date()
    };

    this.notifications.push(notification);

    // Auto dismiss después de 5 segundos
    setTimeout(() => {
      this.dismissNotification(this.notifications.findIndex(n => n.id === notification.id));
    }, 5000);
  }

  dismissNotification(index: number): void {
    if (index >= 0 && index < this.notifications.length) {
      this.notifications.splice(index, 1);
    }
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'success': return 'check_circle';
      case 'error': return 'error';
      case 'warning': return 'warning';
      case 'info': return 'info';
      default: return 'info';
    }
  }

  // Métodos de acción
  createNewRole(): void {
    console.log('Crear nuevo rol');
  }

  importPermissions(): void {
    console.log('Importar permisos');
  }

  exportPermissions(): void {
    console.log('Exportar permisos');
  }

  openPermissionWizard(): void {
    console.log('Abrir asistente de permisos');
  }

  viewFormDetails(): void {
    if (this.currentForm) {
      console.log('Ver detalles de:', this.currentForm.name);
    }
  }
}
