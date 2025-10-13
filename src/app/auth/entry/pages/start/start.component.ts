import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatStepperModule, MatStepper } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import { FormContactComponent } from "../../../../features/organization/assignment/form-contact.component/form-contact.component";
import { TargetPersonComponent } from "../../../../features/security/people/components/target-person/target-person.component";

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
    this.onFinalSubmit();
  }

  // Evento final al terminar todo
  onFinalSubmit() {
    console.log('🎯 Registro completo');
    console.log('Empresa:', this.companyData);
    console.log('Persona:', this.personData);
    // Aquí podrías combinar los datos de empresa y persona
  }
}
