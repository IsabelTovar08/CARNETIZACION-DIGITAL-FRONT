import { ApiService } from './../../../core/Services/api/api.service';
import { Component, signal } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { GenericTableComponent } from "../../../shared/components/generic-table/generic-table.component";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-card-person-list',
  imports: [CommonModule, GenericTableComponent, MatIconModule, ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatCheckboxModule],
  templateUrl: './card-person-list.component.html',
  styleUrl: './card-person-list.component.css'
})
export class CardPersonListComponent {
    /// <summary>
  /// Formulario reactivo con filtros
  /// </summary>
  filterForm!: FormGroup;

  unidadesOrganizacionales = [
    'Administración',
    'Operaciones',
    'Logística',
    'Seguridad'
  ];
  divisionesInternas = [
    'Recursos Humanos',
    'Producción',
    'Transporte',
    'Control de acceso'
  ];
  perfiles = [
    'Coordinadora',
    'Supervisor',
    'Auxiliar',
    'Vigilante'
  ];

  /// <summary>
  /// Fuente de datos para la tabla genérica
  /// </summary>
  dataSource = signal<any[]>([]);

  /// <summary>
  /// Columnas visibles en la tabla genérica
  /// </summary>
  columns = [
    { key: 'photoUrl', label: 'Foto' },
    { key: 'personName', label: 'Nombre completo' },
    { key: 'divisionName', label: 'División interna' },
    { key: 'profileName', label: 'Perfil' },
    { key: 'isCurrentlySelected', label: 'Estado del carnet' },
    { key: 'expirationDate', label: 'Vencimiento' }

  ];

  displayedColumns = [
    'photoUrl',
    'personName',
    'divisionName',
    'profileName',
    'isCurrentlySelected',
    'expirationDate',
    'actions'
  ];

  /// <summary>
  /// Datos quemados para prueba
  /// </summary>
  private peopleMock = [
    {
      photoUrl: '/assets/images/user1.jpg',
      fullName: 'Laura Gómez',
      email: 'laura.gomez@empresa.com',
      organizationalUnit: 'Administración',
      division: 'Recursos Humanos',
      profile: 'Coordinadora',
      cardStatus: 'Activo',
      expirationDate: '2025-12-31'
    },
    {
      photoUrl: '/assets/images/user2.jpg',
      fullName: 'Carlos Martínez',
      email: 'carlos.martinez@empresa.com',
      organizationalUnit: 'Operaciones',
      division: 'Producción',
      profile: 'Supervisor',
      cardStatus: 'Vencido',
      expirationDate: '2024-08-15'
    },
    {
      photoUrl: '/assets/images/user3.jpg',
      fullName: 'Ana Torres',
      email: 'ana.torres@empresa.com',
      organizationalUnit: 'Logística',
      division: 'Transporte',
      profile: 'Auxiliar',
      cardStatus: 'Activo',
      expirationDate: '2026-01-10'
    },
    {
      photoUrl: '/assets/images/user4.jpg',
      fullName: 'Julián Restrepo',
      email: 'julian.restrepo@empresa.com',
      organizationalUnit: 'Seguridad',
      division: 'Control de acceso',
      profile: 'Vigilante',
      cardStatus: 'Activo',
      expirationDate: '2025-07-20'
    }
  ];

  constructor(private fb: FormBuilder,
    private issuedCardService: ApiService<any, any>
  ) {}

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      search: [''],
      organizationalUnit: [''],
      division: [''],
      onlyActive: [true]
    });

    this.dataSource.set(this.peopleMock);

    this.issuedCardService.ObtenerTodo('IssuedCard').subscribe({
      next: (result) => {
        this.peopleMock = result.data;
        this.dataSource.set(this.peopleMock)
      },
      error: (err) => {
        console.error('Error fetching issued cards:', err);
      }
    });
  }

  /// <summary>
  /// Aplica filtros locales sobre la data quemada
  /// </summary>
  loadData(): void {
    const { search, organizationalUnit, division, onlyActive } = this.filterForm.value;
    let filtered = [...this.peopleMock];

    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(p =>
        p.fullName.toLowerCase().includes(s) ||
        p.email.toLowerCase().includes(s)
      );
    }

    if (organizationalUnit)
      filtered = filtered.filter(p => p.organizationalUnit === organizationalUnit);

    if (division)
      filtered = filtered.filter(p => p.division === division);

    if (onlyActive)
      filtered = filtered.filter(p => p.cardStatus === 'Activo');

    this.dataSource.set(filtered);
  }

  /// <summary>
  /// Limpia los filtros y muestra toda la data
  /// </summary>
  resetFilters(): void {
    this.filterForm.reset({ onlyActive: true });
    this.dataSource.set(this.peopleMock);
  }

    /// <summary>
  /// Abre un archivo PDF desde una cadena Base64 en una nueva pestaña del navegador
  /// </summary>
  openPdf(base64Data: string): void {
    try {
      // Convierte la cadena base64 en un Blob
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });

      // Crea una URL temporal para el Blob
      const blobUrl = URL.createObjectURL(blob);

      // Abre el PDF en una nueva pestaña
      window.open(blobUrl, '_blank');
    } catch (error) {
      console.error('Error opening PDF:', error);
    }
  }

}
