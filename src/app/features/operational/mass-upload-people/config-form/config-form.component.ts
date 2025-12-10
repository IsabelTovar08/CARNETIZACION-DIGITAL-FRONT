import { CardsService } from './../../../../core/Services/api/card/cards.service';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatInputModule } from "@angular/material/input";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatSelectModule } from "@angular/material/select";
import { MatCardModule } from "@angular/material/card";
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../../core/Services/api/api.service';
import { InternalDivisionCreate, InternalDivisionList } from '../../../../core/Models/organization/internal-divison.models';
import { ProfileCreate, ProfileList } from '../../../../core/Models/organization/profile.models';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from "@angular/material/icon";
import { TemplateSelectorDialogComponent } from '../template-selector-dialog/template-selector-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-config-form',
  standalone: true,
  imports: [
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatSelectModule,
    MatCardModule,
    CommonModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatIconModule,
  ],
  templateUrl: './config-form.component.html',
  styleUrl: './config-form.component.css'
})
export class ConfigFormComponent implements OnInit {

  @Output() configChanged = new EventEmitter<any>();

  // Estado general
  isPresetSelected = false;
  selectedConfigId: number | null = null;

  // Campos seleccionados
  selectedTemplate: any = null;
  selectedProfileId: number | null = null;
  selectedSheduleId: number | null = null;

  // Nuevo campo: nombre configuración (modo manual)
  configName: string = '';

  validityForm!: FormGroup;

  divisions: InternalDivisionList[] = [];
  filteredDivisions: InternalDivisionList[] = [];
  profiles: ProfileList[] = [];
  schedules: any[] = [];
  templates: any[] = [];
  existingConfigs: any[] = [];

  divisionControl = new FormControl<InternalDivisionList | null>(null);
  // Campo nombre como FormControl
  configNameControl = new FormControl<string | null>(null);


  @ViewChild('input') input!: ElementRef<HTMLInputElement>;

  constructor(
    private divissionService: ApiService<InternalDivisionCreate, InternalDivisionList>,
    private profileService: ApiService<ProfileCreate, ProfileList>,
    private templateService: ApiService<any, any>,
    private scheduleService: ApiService<any, any>,
    private cardService: CardsService,
    private dialog: MatDialog,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.loadData();

    this.validityForm = this.fb.group({
      ValidFrom: [null],
      ValidTo: [null]
    });
  }

  // Cargar TODO
  loadData() {
    this.getTemplates();
    this.getDivisions();
    this.getProfiles();
    this.getSchedules();
    this.getCardConfigurations();
  }

  // ---------------------- CONSULTAS ----------------------

  getTemplates() {
    this.templateService.ObtenerActivos('CardTemplate').subscribe(res => {
      this.templates = res.data;
    });
  }

  getCardConfigurations() {
    this.cardService.ObtenerActivos('Card').subscribe(res => {
      this.existingConfigs = res.data;
    });

  }

  getDivisions() {
    this.divissionService.ObtenerActivos('InternalDivision').subscribe(res => {
      this.divisions = res.data;
      this.filteredDivisions = this.divisions.slice();
    });
  }

  getProfiles() {
    this.profileService.ObtenerActivos('Profile').subscribe(res => {
      this.profiles = res.data;
    });
  }

  getSchedules() {
    this.scheduleService.ObtenerActivos('Schedule').subscribe(res => {
      this.schedules = res.data;
    });
  }

  // ---------------------- Lógica UI ----------------------

  filter() {
    const filterValue = this.input.nativeElement.value.toLowerCase();
    this.filteredDivisions = this.divisions.filter(div =>
      div.name.toLowerCase().includes(filterValue)
    );
  }

  displayDivision(d?: InternalDivisionList) {
    return d ? d.name : '';
  }

  openTemplateSelector() {
    const dialogRef = this.dialog.open(TemplateSelectorDialogComponent, {
      width: '800px',
      data: { templates: this.templates }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      this.selectedTemplate = result;
      this.emitConfig();
    });
  }

  // ---------------------- Selección Configuración ----------------------

  onSelectConfig(config: any) {
    if (!config) {
      // MODO MANUAL
      this.isPresetSelected = false;
      this.selectedConfigId = null;

      this.configNameControl.reset();   // ← limpiar nombre
      this.selectedTemplate = null;
      this.selectedProfileId = null;
      this.validityForm.reset();

      this.emitConfig();
      return;
    }

    // MODO PRESET
    this.isPresetSelected = true;
    this.selectedConfigId = config.id;

    // Rellenar pero NO mostrar
    this.configNameControl.setValue(config.name ?? null);


    // Plantilla
    this.selectedTemplate = {
      id: config.cardTemplateId,
      name: config.cardTemplateName
    };

    // Perfil
    this.selectedProfileId = config.profileId;

    // Vigencia
    this.validityForm.patchValue({
      ValidFrom: config.validFrom ? new Date(config.validFrom) : null,
      ValidTo: config.validTo ? new Date(config.validTo) : null
    });


    // Emitir solo ID + Schedule
    this.configChanged.emit({
      cardConfigurationId: config.id,
      SheduleId: this.selectedSheduleId
    });
  }

  // ---------------------- Emitir Configuración ----------------------

emitConfig() {
  const division = this.divisionControl.value;

  if (this.isPresetSelected && this.selectedConfigId) {
    this.configChanged.emit({
      cardConfigurationId: this.selectedConfigId,
      SheduleId: this.selectedSheduleId,
      InternalDivisionId: division?.id ?? null,
    });
    return;
  }

  this.configChanged.emit({
    SheduleId: this.selectedSheduleId,
    CardConfigurationName: this.configNameControl.value || null,
    InternalDivisionId: division?.id ?? null,
    CardTemplateId: this.selectedTemplate?.id,
    ProfileId: this.selectedProfileId,
    // 🚀 AQUÍ MANDAMOS UTC EXACTO CON Z
    ValidFrom: this.toUtcZ(this.validityForm.value.ValidFrom),
    ValidTo: this.toUtcZ(this.validityForm.value.ValidTo)
  });
}




/// <summary>
/// Convierte una fecha seleccionada a ISO UTC terminado en Z.
/// </summary>
private toUtcZ(date: any): string | null {
  if (!date) return null;

  const d = new Date(date);

  // Ajusta la hora que tú necesites (aquí uso 10:00:00 como tu ejemplo)
  d.setHours(10, 0, 0, 0);

  // Convertir a UTC y asegurar el sufijo Z
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds())).toISOString();
}


}
