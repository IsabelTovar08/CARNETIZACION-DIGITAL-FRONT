import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { OrganizationalService } from '../../../core/Services/api/organizational/organizational.service';
import { Organization, OrganizationUpdate } from '../../../core/Models/organization/organization.models';
import { ApiResponse } from '../../../core/Models/api-response.models';
import { GenericCredincialsComponent } from '../../../shared/components/generic-credincials/generic-credincials.component';
import { VerificationCredencials } from '../../../core/Services/token/verificationCredencials';
import { SnackbarService } from '../../../core/Services/snackbar/snackbar.service';
import { CustomTypeService } from '../../../core/Services/api/customType/custom-type.service';
import { CustomTypeSpecific } from '../../../core/Models/parameter/custom-type.models';

@Component({
  selector: 'app-seccion-organizational',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatIconModule, MatSelectModule, MatOptionModule, GenericCredincialsComponent],
  templateUrl: './seccion-organizational.component.html',
  styleUrl: './seccion-organizational.component.css'
})
export class SeccionOrganizationalComponent implements OnInit {
  isEditable = false;
  isModalOpen = false;
  private fb = inject(FormBuilder);
  private organizationalService = inject(OrganizationalService);
  private userService = inject(VerificationCredencials);
  private snackbarService = inject(SnackbarService);
  private customTypeService = inject(CustomTypeService);

  organizationForm: FormGroup;
  organization: Organization | null = null;
  organizationTypes: CustomTypeSpecific[] = [];

  constructor() {
    this.organizationForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      logo: [''],
      typeId: [0, [Validators.required, Validators.min(1)]]
    });

    // Deshabilitar el formulario para solo lectura
    this.organizationForm.disable();
  }

  ngOnInit(): void {
    this.loadOrganization();
    this.loadOrganizationTypes();
  }

  loadOrganization(): void {
    this.organizationalService.getMyOrganization().subscribe({
      next: (response: ApiResponse<Organization>) => {
        if (response.success && response.data) {
          this.organization = response.data;
          this.organizationForm.patchValue({
            name: response.data.name,
            description: response.data.description || '',
            logo: response.data.logo || '',
            typeId: response.data.typeId
          });
        }
      },
      error: (err) => {
        console.error('Error al cargar la organización', err);
      }
    });
  }

  loadOrganizationTypes(): void {
    this.customTypeService.GetByName('Tipo de organización').subscribe(data => this.organizationTypes = data);
  }

  getOrganizationTypeName(): string {
    const typeId = this.organizationForm.get('typeId')?.value;
    const type = this.organizationTypes.find(t => t.id === typeId);
    return type ? type.name : '';
  }

  isFormValid(): boolean {
    return this.organizationForm.valid;
  }

  getFormData(): OrganizationUpdate {
    return {
      id: this.organization?.id || 0,
      name: this.organizationForm.get('name')?.value || '',
      description: this.organizationForm.get('description')?.value || '',
      logo: this.organizationForm.get('logo')?.value || '',
      typeId: this.organizationForm.get('typeId')?.value || 0
    };
  }

  submitForm(): void {
    if (!this.isFormValid()) {
      this.snackbarService.showError('Complete los campos requeridos');
      return;
    }
    const formData = this.getFormData();
    this.organizationalService.updateMyOrganization(formData).subscribe({
      next: () => {
        this.snackbarService.showSuccess('Organización actualizada correctamente');
        this.isEditable = false;
        this.organizationForm.disable();
        this.loadOrganization(); // Recargar datos
      },
      error: (err) => {
        console.error('Error al actualizar la organización', err);
        this.snackbarService.showError('Error al actualizar la organización');
      }
    });
  }

  onValidacionExitosa(password: string) {
    this.userService.verifyPassword(password).subscribe({
      next: (res) => {
        if (res.status) {
          this.isEditable = true;
          this.organizationForm.enable();
          this.snackbarService.showSuccess('¡Credenciales validadas! Ahora puedes editar la organización.');
        } else {
          this.snackbarService.showError(res.message || 'Contraseña incorrecta.');
        }
        this.isModalOpen = false;
      },
      error: (err) => {
        console.error('Error al verificar contraseña', err);
        this.snackbarService.showError('Hubo un problema al verificar tu contraseña.');
      }
    });
  }

  enableEdit() {
    this.isEditable = true;
    this.organizationForm.enable();
  }

  resetForm() {
    this.organizationForm.disable();
    this.isEditable = false;
  }
}
