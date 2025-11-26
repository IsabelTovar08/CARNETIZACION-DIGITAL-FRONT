import { ApiService } from './../../../core/Services/api/api.service';
import { IssuedCardService } from '../../../core/Services/api/person/generic.service-PDF/issued-card.service';
import { ManagentPersonService, PersonSearchFilters } from '../../../core/Services/api/organizational/managent-person/managent-person.service';
import { Component, signal, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { GenericTableComponent } from "../../../shared/components/generic-table/generic-table.component";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { debounceTime } from 'rxjs/operators';
import { EventService } from '../../../core/Services/api/event/event.service';
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { UserIssuedCardInfoComponent } from '../../../shared/components/user-issued-card-info/user-issued-card-info.component';

@Component({
  selector: 'app-card-person-list',
  imports: [CommonModule, GenericTableComponent, MatIconModule, ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatCheckboxModule, MatPaginatorModule, MatDialogModule],
  templateUrl: './card-person-list.component.html',
  styleUrl: './card-person-list.component.css'
})
export class CardPersonListComponent {
  /// <summary>
  /// Formulario reactivo con filtros
  /// </summary>
  filterForm!: FormGroup;

  /// <summary>
  /// Opciones para los filtros
  /// </summary>
  organizationalUnits: any[] = [];
  internalDivisions: any[] = [];
  profiles: any[] = [];

  /// <summary>
  /// Fuente de datos para la tabla genérica
  /// </summary>
  dataSource = signal<any[]>([]);

  /// <summary>
  /// Información de paginación
  /// </summary>
  totalItems = 0;
  currentPage = 1;
  pageSize = 20;

  /// <summary>
  /// Columnas visibles en la tabla genérica
  /// </summary>
  columns = [
    { key: 'photoUrl', label: 'Foto' },
    { key: 'personName', label: 'Nombre completo' },
    { key: 'internalDivisionNames', label: 'División interna' },
    { key: 'profileName', label: 'Perfil' }
  ];

  displayedColumns = [
    'photoUrl',
    'personName',
    'internalDivisionNames',
    'profileName',
    'actions'
  ];

  @ViewChild('selectCardTemplate') selectCardTemplate!: any;

  selectedCardId: number | null = null;
  private currentPersonCards: any[] = [];



  constructor(private fb: FormBuilder,
    private apiService: ApiService<any, any>,
    private issuedCardService: IssuedCardService,
    private managentPersonService: ManagentPersonService,
    private eventService: EventService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      search: [''],
      organizationalUnit: [''],
      division: [''],
      profile: [''],
      onlyActive: [true]
    });

    // Cargar opciones de filtros
    this.loadFilterOptions();

    // Cargar datos iniciales
    this.loadData();

    // Suscribirse a cambios en el formulario para filtrado automático
    this.filterForm.valueChanges.pipe(debounceTime(300)).subscribe(() => {
      this.loadData();
    });
  }

  /// <summary>
  /// Carga las opciones para los filtros desde la API
  /// </summary>
  private loadFilterOptions(): void {
    console.log('🔧 CardPersonList: Loading filter options...');

    // Cargar unidades organizativas
    this.eventService.getOrganizationalUnits().subscribe({
      next: (result) => {
        this.organizationalUnits = result.data || [];
        console.log('✅ CardPersonList: Organizational units loaded:', this.organizationalUnits);
      },
      error: (err) => {
        console.error('❌ CardPersonList: Error loading organizational units:', err);
      }
    });

    // Cargar divisiones internas
    this.eventService.getInternalDivisions().subscribe({
      next: (result) => {
        this.internalDivisions = result.data || [];
        console.log('✅ CardPersonList: Internal divisions loaded:', this.internalDivisions);
      },
      error: (err) => {
        console.error('❌ CardPersonList: Error loading internal divisions:', err);
      }
    });

    // Cargar perfiles
    this.eventService.getProfiles().subscribe({
      next: (result) => {
        this.profiles = result.data || [];
        console.log('✅ CardPersonList: Profiles loaded:', this.profiles);
      },
      error: (err) => {
        console.error('❌ CardPersonList: Error loading profiles:', err);
      }
    });
  }

  /// <summary>
  /// Carga datos desde la API con filtros y paginación
  /// </summary>
  loadData(): void {
    const { search, organizationalUnit, division, profile, onlyActive } = this.filterForm.value;

    const filters: PersonSearchFilters = {
      internalDivisionId: division ? parseInt(division) : undefined,
      organizationalUnitId: organizationalUnit ? parseInt(organizationalUnit) : undefined,
      profileId: profile ? parseInt(profile) : undefined,
      page: this.currentPage,
      pageSize: this.pageSize
    };

    console.log('🔍 CardPersonList: loadData called with filters:', filters);

    this.managentPersonService.search(filters).subscribe({
      next: (result) => {
        console.log('✅ CardPersonList: API response:', result);
        console.log('📊 CardPersonList: Data received:', result.data);

        // Transformar los datos para que coincidan con las columnas esperadas
        console.log("RAW PERSON RESULT:", result.data);
        let transformedData = (result.data || []).map((person: any) => {

          // Divisiones internas sin duplicados
          const divisions = Array.from(
            new Set(
              (person.cards || [])
                .map((c: any) => c.internalDivisionName)
                .filter((x: any) => x)
            )
          ).join(', ');

          // Perfiles sin duplicados
          const profiles = Array.from(
            new Set(
              (person.cards || [])
                .map((c: any) => c.profileName)
                .filter((x: any) => x)
            )
          ).join(', ');

          return {
            personId: person.id,
            issuedCardId: person.issuedCardId,
            id: person.issuedCardId,
            photoUrl: person.photoUrl || '/assets/images/default-avatar.png',

            personName: person.firstName && person.lastName
              ? `${person.firstName} ${person.lastName}`
              : person.name || 'Sin nombre',

            internalDivisionNames: divisions || 'Sin divisiones',
            profileName: profiles || 'Sin perfiles',

            isCurrentlySelected: person.isCurrentlySelected || false,
            expirationDate: person.expirationDate || null,

            ...person
          };
        });


        // Aplicar filtro de búsqueda en el frontend si hay término de búsqueda
        if (search && search.trim()) {
          const searchTerm = search.trim().toLowerCase();
          transformedData = transformedData.filter(person =>
            person.personName.toLowerCase().includes(searchTerm) ||
            (person.email && person.email.toLowerCase().includes(searchTerm))
          );
        }

        console.log('🔄 CardPersonList: Transformed and filtered data:', transformedData);

        this.dataSource.set(transformedData);
        this.totalItems = result.total || 0;

        console.log('📈 CardPersonList: Total items:', this.totalItems);
      },
      error: (err) => {
        console.error('❌ CardPersonList: Error loading persons:', err);
        this.dataSource.set([]);
        this.totalItems = 0;
      }
    });
  }

  /// <summary>
  /// Maneja el cambio de página
  /// </summary>
  onPageChange(event: any): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadData();
  }

  /// <summary>
  /// Limpia los filtros y recarga los datos
  /// </summary>
  resetFilters(): void {
    this.filterForm.reset({ onlyActive: true });
    this.currentPage = 1;
    this.loadData();
  }

  /// <summary>
  /// Genera y abre el PDF del carnet para el issuedCardId dado
  /// </summary>
  generatePdf(person: any): void {
    if (!person.cards || person.cards.length === 0) {
      console.error("Esta persona no tiene carnets.");
      return;
    }

    // 🔥 Preparar lista de carnets
    this.currentPersonCards = person.cards;

    // Si solo tiene un carnet → PDF directo
    if (person.cards.length === 1) {
      this.selectedCardId = person.cards[0].id;
      this.getPdf(Number(this.selectedCardId));
      return;
    }

    // 🔥 Tiene varios → abrir selector del MISMO componente
    this.selectedCardId = null;

    this.dialog.open(this.selectCardTemplate, {
      width: '400px',
      data: { cards: person.cards }
    });
  }

  onSelectCardConfirm() {
    if (!this.selectedCardId) return;

    this.dialog.closeAll();
    this.getPdf(this.selectedCardId);
  }
  private getPdf(cardId: number) {
    this.issuedCardService.getCardPdf(cardId).subscribe({
      next: (blob) => this.openPdf(blob),
      error: (err) => console.error('Error generating PDF:', err)
    });
  }


  /// <summary>
  /// Abre un archivo PDF desde un Blob en una nueva pestaña del navegador
  /// </summary>
  openPdf(blob: Blob): void {
    try {
      // Crea una URL temporal para el Blob
      const blobUrl = URL.createObjectURL(blob);

      // Abre el PDF en una nueva pestaña
      window.open(blobUrl, '_blank');
    } catch (error) {
      console.error('Error opening PDF:', error);
    }
  }
  openPersonProfile(personId: number) {
    this.dialog.open(UserIssuedCardInfoComponent, {
      width: '850px',
      maxHeight: '90vh',

      data: { personId }
    });
  }



}
