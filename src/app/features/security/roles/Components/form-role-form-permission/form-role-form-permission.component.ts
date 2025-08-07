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


interface Permission {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}

interface RolePermissions {
  roleId: number;
  formId: number;
  permissions: Permission;
  isInherited?: boolean;
  isLocked?: boolean;
}

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
    MatProgressSpinnerModule, MatMenuModule, MatDividerModule, MatInputModule],
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
  rolePermissions: RolePermissions[] = [];
  notifications: Notification[] = [];

  // Datos filtrados
  filteredRoles: Role[] = [];
  filteredForms: FormModule[] = [];

  // Control de estado
  currentForm: FromModel | null = null;
  originalPermissions: RolePermissions[] = [];
    listRoles$!: Observable<Role[]>;
    listForm$!: Observable<FromModel[]>;
    listModule$!: Observable<Module[]>;
    listRolFormPermission$!: Observable<Module[]>;





  constructor(private dialog: MatDialog,
    private apiServiceRole: ApiService<Role, Role>,
    private apiServiceForm: ApiService<FromModel, FromModel>,
    private apiServiceModule: ApiService<Module, Module>,


  ) {
    this.initializeData();
  }

  ngOnInit(): void {

  }

  // Inicialización de datos mock
  private initializeData(): void {
    this.listRoles$ = this.apiServiceRole.ObtenerTodo('Rol')
    this.listForm$ = this.apiServiceForm.ObtenerTodo('Form')
    this.listModule$ = this.apiServiceForm.ObtenerTodo('Module')


    // Generar permisos iniciales
    this.applyFilter();
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

  applyFilter(): void {
    switch (this.selectedFilter) {
      case 'all':
        this.filteredRoles = [...this.roles];
        this.filteredForms = [...this.forms];
        break;
      case 'granted':
        this.filteredRoles = this.roles.filter(role =>
          this.forms.some(form => this.hasAnyPermission(role.id, form.id))
        );
        break;
      case 'denied':
        this.filteredRoles = this.roles.filter(role =>
          this.forms.some(form => !this.hasAnyPermission(role.id, form.id))
        );
        break;
      case 'partial':
        this.filteredRoles = this.roles.filter(role =>
          this.forms.some(form => this.hasPartialPermission(role.id, form.id))
        );
        break;
    }
    this.filterData();
  }

  // Métodos de permisos
  getPermission(roleId: number, formId: number): RolePermissions | null {
    return this.rolePermissions.find(rp =>
      rp.roleId === roleId && rp.formId === formId
    ) || null;
  }

  hasSpecificPermission(roleId: number, formId: number, permission: keyof Permission): boolean {
    const rolePermission = this.getPermission(roleId, formId);
    return rolePermission?.permissions[permission] || false;
  }

  hasAnyPermission(roleId: number, formId: number): boolean {
    const rolePermission = this.getPermission(roleId, formId);
    if (!rolePermission) return false;

    const { create, read, update, delete: del } = rolePermission.permissions;
    return create || read || update || del;
  }

  hasPartialPermission(roleId: number, formId: number): boolean {
    const rolePermission = this.getPermission(roleId, formId);
    if (!rolePermission) return false;

    const permissions = Object.values(rolePermission.permissions);
    const trueCount = permissions.filter(p => p).length;
    return trueCount > 0 && trueCount < permissions.length;
  }

  getPermissionClass(roleId: number, formId: number): string {
    const rolePermission = this.getPermission(roleId, formId);
    if (!rolePermission) return 'no-access';

    const permissions = Object.values(rolePermission.permissions);
    const trueCount = permissions.filter(p => p).length;

    if (trueCount === 0) return 'no-access';
    if (trueCount === permissions.length) return 'full-access';
    return 'partial-access';
  }

  getPermissionIcon(roleId: number, formId: number): string {
    const permissionClass = this.getPermissionClass(roleId, formId);

    switch (permissionClass) {
      case 'full-access': return 'check_circle';
      case 'partial-access': return 'remove_circle';
      case 'no-access': return 'cancel';
      default: return 'help';
    }
  }

  getPermissionLabel(roleId: number, formId: number): string {
    const permissionClass = this.getPermissionClass(roleId, formId);

    switch (permissionClass) {
      case 'full-access': return 'Completo';
      case 'partial-access': return 'Parcial';
      case 'no-access': return 'Sin Acceso';
      default: return 'Indefinido';
    }
  }

  // Métodos de cambios
  hasPermissionChanges(roleId: number, formId: number): boolean {
    const current = this.getPermission(roleId, formId);
    const original = this.originalPermissions.find(rp =>
      rp.roleId === roleId && rp.formId === formId
    );

    if (!current || !original) return false;

    return JSON.stringify(current.permissions) !== JSON.stringify(original.permissions);
  }

  // Acciones rápidas
  quickGrantPermission(role: any, form: any): void {

    const dialogRef = this.dialog.open(ModalPermissionsComponent, {
      width: '500px',
      data: {
        roleName: role.name,
        formName: form.name,
      }
    });
  }

  quickRevokePermission(roleId: number, formId: number, event: Event): void {
    event.stopPropagation();

    const rolePermission = this.getPermission(roleId, formId);
    if (rolePermission && !rolePermission.isLocked) {
      rolePermission.permissions = {
        create: false,
        read: false,
        update: false,
        delete: false
      };
      this.checkForChanges();
      this.showNotification('warning', 'Permisos revocados');
    }
  }

  // Acciones en lote
  bulkPermissionAction(action: string): void {
    this.isLoading = true;

    switch (action) {
      case 'grant-all':
        this.loadingMessage = 'Concediendo todos los permisos...';
        this.rolePermissions.forEach(rp => {
          if (!rp.isLocked) {
            rp.permissions = { create: true, read: true, update: true, delete: true };
          }
        });
        break;

      case 'revoke-all':
        this.loadingMessage = 'Revocando todos los permisos...';
        this.rolePermissions.forEach(rp => {
          if (!rp.isLocked) {
            rp.permissions = { create: false, read: false, update: false, delete: false };
          }
        });
        break;
    }

    setTimeout(() => {
      this.isLoading = false;
      this.checkForChanges();
      this.showNotification('success', 'Acción en lote completada');
    }, 1000);
  }

  // Métodos de control
  checkForChanges(): void {
    this.hasChanges = this.rolePermissions.some((current, index) => {
      const original = this.originalPermissions[index];
      return JSON.stringify(current.permissions) !== JSON.stringify(original.permissions);
    });
  }

  saveAllPermissions(): void {
    this.isLoading = true;
    this.loadingMessage = 'Guardando cambios...';

    // Simular guardado
    setTimeout(() => {
      this.originalPermissions = JSON.parse(JSON.stringify(this.rolePermissions));
      this.hasChanges = false;
      this.isLoading = false;
      this.showNotification('success', 'Permisos guardados exitosamente');
    }, 2000);
  }

  resetChanges(): void {
    this.rolePermissions = JSON.parse(JSON.stringify(this.originalPermissions));
    this.hasChanges = false;
    this.showNotification('info', 'Cambios descartados');
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
    if (!this.currentForm) return;

    this.rolePermissions
      .filter(rp => rp.formId === this.currentForm!.id && !rp.isLocked)
      .forEach(rp => {
        rp.permissions = { create: true, read: true, update: true, delete: true };
      });

    this.checkForChanges();
    this.showNotification('success', `Permisos concedidos para ${this.currentForm.name}`);
  }

  revokeAllForForm(): void {
    if (!this.currentForm) return;

    this.rolePermissions
      .filter(rp => rp.formId === this.currentForm!.id && !rp.isLocked)
      .forEach(rp => {
        rp.permissions = { create: false, read: false, update: false, delete: false };
      });

    this.checkForChanges();
    this.showNotification('warning', `Permisos revocados para ${this.currentForm.name}`);
  }

  // Métodos auxiliares


  getTotalForms(): number {
    return this.forms.filter(f => f.isActive).length;
  }

  getTotalPermissions(): number {
    return this.rolePermissions.filter(rp => this.hasAnyPermission(rp.roleId, rp.formId)).length;
  }

  getPermissionCoverage(): number {
    const total = this.roles.length * this.forms.length;
    const configured = this.getTotalPermissions();
    return Math.round((configured / total) * 100);
  }

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
