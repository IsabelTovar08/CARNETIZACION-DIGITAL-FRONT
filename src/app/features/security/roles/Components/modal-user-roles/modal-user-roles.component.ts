import { Component, Inject } from '@angular/core';
import { UserRolesService } from '../../../../../core/Services/api/user-role/user-roles.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserRolCreateAll } from '../../../../../core/Models/security/user-roles.models';
import { GenericFormComponent } from "../../../../../shared/components/generic-form/generic-form.component";
import { UserList } from '../../../../../core/Models/security/user.models';
import { Role } from '../../../../../core/Models/security/role.models';
import { DataService } from '../../../../../core/Services/shared/data.service';

@Component({
  selector: 'app-modal-user-roles',
  imports: [GenericFormComponent],
  templateUrl: './modal-user-roles.component.html',
  styleUrl: './modal-user-roles.component.css'
})
export class ModalUserRolesComponent {
  user!: UserList;
  listRoles: Role[] = [];
  assignedRoleIds: number[] = [];
  formFields: any[] = [];

  constructor(
    private dialogRef: MatDialogRef<ModalUserRolesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userRoleService: UserRolesService,
    private dataService: DataService

  ) {}

  ngOnInit(): void {
    this.dataService.roles$.subscribe(data => this.listRoles = data);
    this.dataService.getRoles();

    this.user = this.data.user;
    this.assignedRoleIds = this.data.assignedRoleIds || [];

    this.buildFormFields();
  }

  buildFormFields() {
    this.formFields = this.listRoles.map(role => ({
      name: 'role_' + role.id,
      label: role.name,
      type: 'checkbox',
      value: this.assignedRoleIds.includes(role.id)
    }));
  }

  onSave(formValue: any) {
    const selectedRoleIds = Object.entries(formValue)
      .filter(([key, checked]) => checked && key.startsWith('role_'))
      .map(([key]) => parseInt(key.replace('role_', ''), 10));
     var data: UserRolCreateAll ={
      userId: this.user.id,
      rolesId: selectedRoleIds
    }
    this.userRoleService.saveAllRoles(data).subscribe(() => {
      this.dialogRef.close(true);
    });
  }

  onCancel() {
    this.dialogRef.close(null);
  }
}
