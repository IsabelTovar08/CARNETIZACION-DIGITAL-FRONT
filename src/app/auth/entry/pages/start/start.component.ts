import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatStepperModule, MatStepper } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import { FormContactComponent } from "../../../../features/organization/assignment/form-contact.component/form-contact.component";
import { TargetPersonComponent } from "../../../../features/security/people/components/target-person/target-person.component";
import { NotificationsService } from '../../../../core/Services/api/notifications/notifications.service';
import { SnackbarService } from '../../../../core/Services/snackbar/snackbar.service';
import { ContactOrganizationRequest } from '../../../../core/Models/organization/contact-organization';


@Component({
  selector: 'app-start',
  standalone: true,
  imports: [
    CommonModule,
    MatStepperModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    FormContactComponent,
    TargetPersonComponent
  ],
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent {
  @ViewChild('stepper') stepper!: MatStepper;

  isLinear = true;
  companyData: any = null;
  personData: any = null;

  constructor(
    private notificationsService: NotificationsService,
    private snackbar: SnackbarService
  ) {}

  // Evento cuando se completa el formulario de empresa
  onCompanySubmitted(data: any) {
    console.log('✅ Empresa enviada:', data);
    this.companyData = data;
    // Avanzar al siguiente paso automáticamente
    this.stepper.next();
  }

  // Evento cuando se completa el formulario de persona
  onPersonSubmitted(data: any) {
    console.log('✅ Persona enviada:', data);
    this.personData = data;
    // Aquí podrías procesar el registro completo
    // this.stepper.next();
    this.onFinalSubmit();
  }

  // Evento final al terminar todo
 onFinalSubmit() {
    if (!this.companyData || !this.personData) {
      this.snackbar.showError('Faltan datos por completar');
      return;
    }

    // Combinar los datos con la estructura que espera el backend
    const request: ContactOrganizationRequest  = {
      id: 0,
      companyName: this.companyData.companyName,
      message: this.companyData.message || 'Solicitud de contacto',
      companyEmail: this.companyData.email || this.companyData.email,
      advisorName: this.companyData.advisorName,
      advisorLastName: this.companyData.advisorLastName || '',
      email: this.companyData.email,
      phoneNumber: this.companyData.phone,
      advisorRole: this.companyData.position || 'Asesor',
      documentTypeId: this.personData.documentTypeId,
      documentNumber: this.personData.documentNumber,
      address: this.personData.address,
      cityId: this.personData.cityId,
      bloodTypeId: this.personData.bloodTypeId,
      person: {
        id: 0,
        firstName: this.personData.firstName,
        middleName: this.personData.middleName,
        lastName: this.personData.lastName,
        secondLastName: this.personData.secondLastName,
        documentTypeId: this.personData.documentTypeId,
        documentNumber: this.personData.documentNumber,
        bloodTypeId: this.personData.bloodTypeId,
        phone: this.personData.phone,
        email: this.personData.email,
        address: this.personData.address,
        cityId: this.personData.cityId
      }
    };

    console.log('JSON final enviado al backend:', request);

    // Llamada al backend
    this.notificationsService.createAndSendNotification(request).subscribe({
      next: (res) => {
        console.log('✅ Respuesta del backend:', res);
        this.snackbar.showSuccess('Solicitud enviada con éxito.');
        this.stepper.reset();
      },
      error: (err) => {
        console.error('❌ Error al enviar la solicitud:', err);
        this.snackbar.showError('Error al enviar la solicitud.');
      }
    });
  }
  }

