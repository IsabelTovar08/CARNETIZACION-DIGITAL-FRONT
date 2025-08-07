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
export interface Permission {
  id: string;
  name: string;
  description?: string;
  selected: boolean;
}

export interface ModalData {
  roleName?: string;
  formName?: string;
  permissions: Permission[];
}
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
  permissionsForm: FormGroup;
  listPermissins$!: Observable<Permission[]>;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ModalPermissionsComponent>,
    private permisionService: ApiService<Permission, Permission>,
    @Inject(MAT_DIALOG_DATA) public data: ModalData
  ) {
    this.permissionsForm = this.createForm();
  }

  ngOnInit(): void {
    this.listPermissins$ = this.permisionService.ObtenerTodo('Permission');

    // Inicializar valores si se proporcionaron
    if (this.data.roleName) {
      this.permissionsForm.get('roleName')?.setValue(this.data.roleName);
    }
    if (this.data.formName) {
      this.permissionsForm.get('formName')?.setValue(this.data.formName);
    }
  }

  private createForm(): FormGroup {
    // const permissionsArray = this.fb.array(
    //   this.permissions.map(permission => new FormControl(permission.selected))
    // );

    return this.fb.group({
      roleName: [''],
      formName: [''],
      // permissions: permissionsArray
    });
  }


  get permissionsArray(): FormArray {
    return this.permissionsForm.get('permissions') as FormArray;
  }

  selectAll(): void {
    this.permissionsArray.controls.forEach(control => control.setValue(true));
  }

  deselectAll(): void {
    this.permissionsArray.controls.forEach(control => control.setValue(false));
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }

  // onSave(): void {
  //   const formValue = this.permissionsForm.value;
  //   const selectedPermissions = this.permissions.filter((_, index) =>
  //     formValue.permissions[index]
  //   );

  //   const result = {
  //     roleName: formValue.roleName,
  //     formName: formValue.formName,
  //     selectedPermissions: selectedPermissions
  //   };

  //   this.dialogRef.close(result);
  // }
}
