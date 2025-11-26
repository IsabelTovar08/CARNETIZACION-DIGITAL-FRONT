import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { ManagentPersonService } from '../../../core/Services/api/organizational/managent-person/managent-person.service';
import { EventService } from '../../../core/Services/api/event/event.service';
import { PersonSearchFilters, PersonSearchResponse, PersonDto } from '../../../core/Models/organization/person-search.models';
import { SelectOption } from '../../../core/Models/operational/event.model';

@Component({
  selector: 'app-supervisor-selection-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatPaginatorModule,
    FormsModule
  ],
  templateUrl: './supervisor-selection-modal.component.html',
  styleUrls: ['./supervisor-selection-modal.component.css']
})
export class SupervisorSelectionModalComponent implements OnInit {
  // Filtros
  selectedProfile: string = '';
  selectedOrganizationalUnit: string = '';
  selectedInternalDivision: string = '';

  // Opciones para filtros
  profileOptions: SelectOption[] = [];
  organizationalUnitOptions: SelectOption[] = [];
  internalDivisionOptions: SelectOption[] = [];

  // Lista de personas
  persons: PersonDto[] = [];
  filteredPersons: PersonDto[] = [];
  totalPersons = 0;
  currentPage = 1;
  pageSize = 20;
  loading = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { eventId: number },
    private dialogRef: MatDialogRef<SupervisorSelectionModalComponent>,
    private personService: ManagentPersonService,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.loadFilterOptions();
    this.loadPersons();
  }

  private loadFilterOptions(): void {
    // Cargar perfiles
    this.eventService.getProfiles().subscribe({
      next: (response) => {
        this.profileOptions = response.data || [];
      },
      error: (error) => {
        console.error('Error al cargar perfiles:', error);
      }
    });

    // Cargar unidades organizativas
    this.eventService.getOrganizationalUnits().subscribe({
      next: (response) => {
        this.organizationalUnitOptions = response.data || [];
      },
      error: (error) => {
        console.error('Error al cargar unidades organizativas:', error);
      }
    });

    // Cargar divisiones internas
    this.eventService.getInternalDivisions().subscribe({
      next: (response) => {
        this.internalDivisionOptions = response.data || [];
      },
      error: (error) => {
        console.error('Error al cargar divisiones internas:', error);
      }
    });
  }

  private loadPersons(): void {
    this.loading = true;
    
    const filters: PersonSearchFilters = {
      page: this.currentPage,
      pageSize: this.pageSize,
      profileId: this.selectedProfile ? Number(this.selectedProfile) : undefined,
      organizationalUnitId: this.selectedOrganizationalUnit ? Number(this.selectedOrganizationalUnit) : undefined,
      internalDivisionId: this.selectedInternalDivision ? Number(this.selectedInternalDivision) : undefined
    };

    this.personService.search(filters).subscribe({
      next: (response: PersonSearchResponse) => {
        this.persons = response.data;
        this.filteredPersons = [...this.persons];
        this.totalPersons = response.total;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar personas:', error);
        this.loading = false;
      }
    });
  }

  search(): void {
    this.currentPage = 1;
    this.loadPersons();
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadPersons();
  }

  selectPerson(person: PersonDto): void {
    // Enviar el userId del supervisor seleccionado
    this.dialogRef.close({
      supervisorUserIds: [person.userId],
      selectedPerson: person
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}