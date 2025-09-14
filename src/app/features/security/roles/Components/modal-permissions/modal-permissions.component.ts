import { Permission } from './../../../../../core/Models/security/permission.models';
import { Observable } from 'rxjs';
import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../../../core/Services/api/api.service';
import { FromModel } from '../../../../../core/Models/security/form.models';
import { DataService } from '../../../../../core/Services/shared/data.service';
import { Role, RoleFormPermisionsRequest } from '../../../../../core/Models/security/role.models';
import { RolFormPermissionService } from '../../../../../core/Services/api/rol-form-permission/rol-form-permission.service';

@Component({
  selector: 'app-modal-permissions',
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  templateUrl: './modal-permissions.component.html',
  styleUrl: './modal-permissions.component.css'
})
export class ModalPermissionsComponent {
  permissionsForm!: FormGroup;
  listPermissions!: Permission[];
  role!: Role;
  form!: FromModel;
  permissionsSelected?: number[];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ModalPermissionsComponent>,
    private rfpermisionService: RolFormPermissionService,
    private dataService: DataService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit(): void {
    // Inicializar listas desde data
    if (this.data.permissions) {
      this.listPermissions = this.data.permissions;
    }
    if (this.data.role) {
      this.role = this.data.role;
    }
    if (this.data.form) {
      this.form = this.data.form;
    }

    // Cargar permisos seleccionados si vienen por parámetro
    this.permissionsSelected = this.data.selectedPermissionIds
      ? [...this.data.selectedPermissionIds]
      : [];

    // Suscribirse a cambios en la lista de permisos
    this.dataService.permissions$.subscribe(data => {
      this.listPermissions = data;
    });
    this.dataService.getPermissions();

    // Crear formulario con valores iniciales
    this.createForm();
  }

  private createForm(): void {
    this.permissionsForm = this.fb.group({
      permissions: [this.permissionsSelected] // IDs seleccionados por defecto
    });
  }


  // Getter para acceder fácil al FormArray

  togglePermission(id: number, checked: boolean) {
    if (checked) {
      if (!this.permissionsSelected?.includes(id)) {
        this.permissionsSelected?.push(id);
      }
    } else {
      this.permissionsSelected = this.permissionsSelected?.filter(p => p !== id);
    }
  }


  onSubmit() {
    this.permissionsForm.patchValue({ permissions: this.permissionsSelected });
    console.log(this.permissionsForm.value);
    var data: RoleFormPermisionsRequest = {
      RoleId: this.role.id,
      FormId: this.form.id,
      PermissionsIds: this.permissionsForm.value.permissions
    }

    this.rfpermisionService.savePermissions(data).subscribe(() => {
      this.dialogRef.close(true);
    })
  }


  onCancel(): void {
    this.dialogRef.close(null);
  }

}
