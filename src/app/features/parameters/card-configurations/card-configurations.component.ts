import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

import { MatDialog } from '@angular/material/dialog';
import { CardsService } from '../../../core/Services/api/card/cards.service';
import { GenericTableComponent } from '../../../shared/components/generic-table/generic-table.component';
import { TemplateSelectorDialogComponent } from '../../operational/mass-upload-people/template-selector-dialog/template-selector-dialog.component';
import { SnackbarService } from '../../../core/Services/snackbar/snackbar.service';

@Component({
  selector: 'app-card-configurations',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    GenericTableComponent,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatIconModule,
    MatChipsModule
  ],
  templateUrl: './card-configurations.component.html',
  styleUrl: './card-configurations.component.css'
})
export class CardConfigurationsComponent implements OnInit {

  private cardService = inject(CardsService);
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);
  private snackbar = inject(SnackbarService);

  /** Tabla */
  displayedColumns = [
    'name', 'profileName', 'cardTemplateName',
    'validFrom', 'validTo', 'totalIssued', 'actions'
  ];

  columns = [
    { key: 'name', label: 'Nombre' },
    { key: 'profileName', label: 'Perfil' },
    { key: 'cardTemplateName', label: 'Plantilla' },
    { key: 'validFrom', label: 'Desde' },
    { key: 'validTo', label: 'Hasta' },
    { key: 'totalIssued', label: 'Afecta a' }
  ];

  configs = signal<any[]>([]);
  selectedConfig = signal<any | null>(null);

  /** Formulario */
  form!: FormGroup;

  /** Plantillas */
  templates: any[] = [];

  ngOnInit(): void {
    this.buildForm();
    this.loadConfigurations();
    this.loadTemplates();
  }

  buildForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      cardTemplateId: [null, Validators.required],
      validFrom: [null, Validators.required],
      validTo: [null, Validators.required]
    });
  }

  /** Cargar configuraciones */
  loadConfigurations() {
    this.cardService.ObtenerActivos('Card').subscribe(res => {
      this.configs.set(res.data);
    });
  }

  loadTemplates() {
    this.cardService.ObtenerActivos('CardTemplate').subscribe(res => {
      this.templates = res.data;
    });
  }

  /** Al seleccionar fila */
  onEdit(config: any) {
    this.selectedConfig.set(config);

    this.form.patchValue({
      name: config.name,
      cardTemplateId: config.cardTemplateId,
      validFrom: new Date(config.validFrom),
      validTo: new Date(config.validTo)
    });
  }

  /** Selector de plantilla */
  openTemplateSelector() {
    const ref = this.dialog.open(TemplateSelectorDialogComponent, {
      width: '850px',
      data: { templates: this.templates }
    });

    ref.afterClosed().subscribe(result => {
      if (result) {
        this.form.patchValue({ cardTemplateId: result.id });
      }
    });
  }

  /** Guardar cambios */
  save() {
    if (!this.selectedConfig() || this.form.invalid) return;

    const payload = {
      id: this.selectedConfig().id,
      profileId: this.selectedConfig().profileId,
      statusId: this.selectedConfig().statusId,
      ...this.form.value
    };

    this.cardService.update('Card', payload).subscribe({
      next: () => {
        this.loadConfigurations()
        this.snackbar.showSuccess("Configuración actualizada exitosamente.")
      }
    });
  }
}
