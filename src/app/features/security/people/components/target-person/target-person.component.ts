import { ApiService } from './../../../../../core/Services/api/api.service';
import { Component, Inject, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from "@angular/material/card";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { CustomTypeService } from '../../../../../core/Services/api/customType/custom-type.service';
import { UbicationService } from '../../../../../core/Services/api/ubication/ubication.service';
import { CustomTypeSpecific } from '../../../../../core/Models/parameter/custom-type.models';
import { CityCreate, CityList, Deparment } from '../../../../../core/Models/parameter/ubication.models';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { GenericFormComponent } from '../../../../../shared/components/generic-form/generic-form.component';
import { PersonCreate, PersonList } from '../../../../../core/Models/security/person.models';
import { ActionButtonsComponent } from "../../../../../shared/components/action-buttons/action-buttons.component";
import { MatDividerModule } from "@angular/material/divider";
import { MatButtonModule } from '@angular/material/button';
import { ChangePasswordComponent } from '../../../users/components/change-password/change-password.component';
import { ListService } from '../../../../../core/Services/shared/list.service';
import { ScheduleList } from '../../../../../core/Models/organization/schedules.models';

@Component({
  selector: 'app-target-person',
  imports: [MatCardModule, MatInputModule, MatSelectModule, ReactiveFormsModule, CommonModule, ActionButtonsComponent, MatDividerModule, MatButtonModule],
  templateUrl: './target-person.component.html',
  styleUrl: './target-person.component.css'
})
export class TargetPersonComponent {

  profileForm!: FormGroup;
  documentTypes: CustomTypeSpecific[] = [];

  bloodTypes: CustomTypeSpecific[] = [];

  cities: CityCreate[] = [];
  deparments: Deparment[] = [];

  schedules: ScheduleList[] = [];

  constructor(private fb: FormBuilder,
    private listService: ListService,
    private ubicationService: UbicationService,
    protected dialogRef: MatDialogRef<GenericFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private apiServicePerson: ApiService<PersonCreate, PersonList>

  ) { }

  ngOnInit(): void {
    console.log(this.data)
    this.profileForm = this.fb.group({
      id: [this.data.item.id || ''],
      firstName: [this.data.item.firstName || '', [Validators.required, Validators.minLength(2)]],
      middleName: [this.data.item.middleName || '', [Validators.minLength(2)]],
      lastName: [this.data.item.lastName || '', [Validators.required, Validators.minLength(2)]],
      secondLastName: [this.data.item.secondLastName || ''],
      documentTypeId: [this.data.item.documentTypeId || 0, [Validators.required, Validators.min(1)]],
      documentNumber: [this.data.item.documentNumber || '', [Validators.required, Validators.minLength(6)]],
      bloodTypeId: [this.data.item.bloodTypeId || 0, [Validators.required, Validators.min(1)]],
      phone: [this.data.item.phone || '', [Validators.required, Validators.pattern(/^[0-9+\-\s()]+$/)]],
      email: [this.data.item.email || '', [Validators.required, Validators.email]],
      address: [this.data.item.address || '', Validators.minLength(10)],
      departmentId: [this.data.item.departmentId || 0],
      cityId: [this.data.item.cityId || 0, [Validators.required]],
    });

    this.getData()

    this.profileForm.get('departmentId')?.valueChanges.subscribe(departmentId => {
      if (departmentId) {
        this.getCytie(departmentId);
        this.profileForm.get('cityId')?.enable();
      } else {
        this.cities = [];
        this.profileForm.get('cityId')?.setValue(null);
        this.profileForm.get('cityId')?.disable();
      }
    });

  }

  getData(){
    this.listService.getdocumentTypes().subscribe(data => this.documentTypes = data);
    this.listService.getbloodTypes().subscribe(data => this.bloodTypes = data);
    this.listService.getdeparments().subscribe(data => this.deparments = data);
    this.listService.getCities().subscribe(data => this.cities = data);

  }

  getCytie(id: number) {
    this.ubicationService.GetCytiesByDeparment(id).subscribe((data) => {
      this.cities = data.data;
      console.log(data)
    })
  }
  onSubmit() {
    if (this.profileForm.valid) {
      console.log('Datos enviados:', this.profileForm.value);
      this.apiServicePerson.update('Person', this.profileForm.value).subscribe((data) => {
        console.log(data);
        // this.toastr.success('Persona actualizada con éxito');
        // this.router.navigate(['/personas']);
      }, (error) => {
        console.error(error);
        // this.toastr.error('Error al actualizar persona');
      });

    }
  }
  onChangePassword() {
    const dialogRef = this.dialog.open(ChangePasswordComponent, {
      disableClose: true,
      width: '400px',
      data: { email: this.profileForm.get('email')?.value }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Aquí puedes llamar al backend para actualizar la contraseña
        console.log('Contraseña actualizada');
      }
    });
  }
}
