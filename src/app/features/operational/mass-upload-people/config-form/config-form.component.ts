import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatInputModule } from "@angular/material/input";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatSelectModule } from "@angular/material/select";
import { MatCardModule } from "@angular/material/card";
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../../core/Services/api/api.service';
import { InternalDivisionCreate, InternalDivisionList } from '../../../../core/Models/organization/internal-divison.models';
import { ProfileCreate, ProfileList } from '../../../../core/Models/organization/profile.models';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { map, Observable, startWith } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from "@angular/material/icon";
import { TemplateSelectorDialogComponent } from '../template-selector-dialog/template-selector-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-config-form',
  imports: [MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatSelectModule, MatCardModule, CommonModule, MatAutocompleteModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './config-form.component.html',
  styleUrl: './config-form.component.css'
})
export class ConfigFormComponent implements OnInit {
  templates: any[] = [];
  divisions: InternalDivisionList[] = [];
  profiles: any[] = [];
  @ViewChild('input') input!: ElementRef<HTMLInputElement>;
  filteredDivisions = this.divisions.slice();
  selectedTemplate: any = null;
  validityForm!: FormGroup;

  // Control del input
  divisionControl = new FormControl<InternalDivisionList | null>(null);
  @Output() configChanged = new EventEmitter<any>();
  /**
   *
   */
  constructor(
    private divissionService: ApiService<InternalDivisionCreate, InternalDivisionList>,
    private profileService: ApiService<ProfileCreate, ProfileList>,
    private templateService: ApiService<any, any>,
    private dialog: MatDialog,
    private fb: FormBuilder,
  ) {


  }
  ngOnInit(): void {
    this.getData();

    this.validityForm = this.fb.group({
      ValidFrom: [null],
      ValidTo: [null]
    });
  }


  filter(): void {
    const filterValue = this.input.nativeElement.value.toLowerCase();
    this.filteredDivisions = this.divisions.filter(div =>
      div.name.toLowerCase().includes(filterValue)
    );
  }

  displayDivision(division?: InternalDivisionList): string {
    return division ? division.name : '';
  }
  emitConfig() {
    const division = this.divisionControl.value;
    console.log('División seleccionada:', division
    );
    this.configChanged.emit({
      OrganizationId: 1,
      OrganizationCode: 'ORG001',
      OrganizationalUnitId: 1,
      OrganizationalUnitCode: 'UNIT001',
      InternalDivisionId: division?.id ?? 0,
      InternalDivisionCode: division?.code ?? 'CODE001',
      CardTemplateId: this.selectedTemplate?.id ?? 0,
      CardTemplateCode: this.selectedTemplate?.code ?? 'CODE001',
      ProfileId: this.profiles.find(p => p.id)?.id ?? 0,
      ValidFrom: this.validityForm.value.ValidFrom
        ? new Date(this.validityForm.value.ValidFrom).toISOString()
        : null,
      ValidTo: this.validityForm.value.ValidTo
        ? new Date(this.validityForm.value.ValidTo).toISOString()
        : null
    });
  }


  getData() {
    this.getTemplates();
    this.getDivisions();
    this.getProfiles();
  }

  getTemplates() {
    this.templateService.ObtenerTodo('CardTemplate').subscribe(data =>
      this.templates = data.data
    );
  }

  getDivisions() {
  this.divissionService.ObtenerTodo('InternalDivision').subscribe(data => {
    this.divisions = data.data;
    this.filteredDivisions = this.divisions.slice(); // ✅ refresca la lista inicial
  });
}

  getProfiles() {
    this.profileService.ObtenerTodo('Profile').subscribe(data =>
      this.profiles = data.data
    );

  }


  openTemplateSelector() {
    const dialogRef = this.dialog.open(TemplateSelectorDialogComponent, {
      width: '800px',
      data: { templates: this.templates }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.selectedTemplate = result;
        console.log('Plantilla seleccionada:', this.selectedTemplate);
      }
    });
  }

}
