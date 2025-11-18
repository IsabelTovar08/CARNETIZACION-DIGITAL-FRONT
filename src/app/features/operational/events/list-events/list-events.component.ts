import { Component, OnInit } from '@angular/core';
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../../core/Services/api/api.service';
import { SnackbarService } from '../../../../core/Services/snackbar/snackbar.service';
import { Event } from '../../../../core/Models/operational/event.model';
import { EventService } from '../../../../core/Services/api/event/event.service';
import { AttendanceService } from '../../../../core/Services/api/attendance.service/attendance.service';
import { EventTagsModalComponent } from '../../../../shared/components/event-tags-modal/event-tags-modal.component';
import { AttendanceModalComponent } from '../../../../shared/components/attendance-modal/attendance-modal.component';
import { CardItem, GenericListCardsComponent } from '../../../../shared/components/components-cards/generic-list-cards/generic-list-cards.component';
import { GenericListCardComponent } from "../../../../shared/components/generic-list-card/generic-list-card.component";
import { MatChip, MatChipSet } from "@angular/material/chips";
import Swal from 'sweetalert2';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-list-events',
  imports: [MatIconModule,MatTooltipModule,MatMenuModule, GenericListCardsComponent, MatButtonModule, MatSelectModule, MatFormFieldModule, GenericListCardComponent, MatChip, MatChipSet],
  templateUrl: './list-events.component.html',
  styleUrl: './list-events.component.css'
})
export class ListEventsComponent implements OnInit {
  listEvents: any[] = [];
  allEvents: any[] = []; // Para almacenar todos los eventos sin filtrar

  // Filtros
  selectedStatus: string = 'Todos';
  selectedType: string = 'Todos';
  selectedVisibility: string = 'Todos';

  // Opciones para filtros
  statusOptions: string[] = ['Todos', 'Activo', 'Inactivo'];
  typeOptions: string[] = ['Todos'];
  visibilityOptions: string[] = ['Todos', 'Público', 'Privado'];

  /**
    *
    */
   constructor(
     private apiService: ApiService<Event, Event>,
     private eventService: EventService,
     private attendanceService: AttendanceService,
     private route: ActivatedRoute,
     private router: Router,
     private dialog: MatDialog,
     private snackbarService: SnackbarService,

   ) {

   }
  ngOnInit(): void {
    this.loadEvents();
  }

  
  openTagsModal(e: any) {
  this.dialog.open(EventTagsModalComponent, {
    width: '520px',
    data: {
      title: e.title ?? e.name,
      description: e.description,
      dateLabel: e.dateLabel,
      eventType: e.eventTypeName,
      tags: e.fullTags ?? [],
      accessPoints: e.accessPoints ?? [],
      schedules: e.schedules ?? []
    }
  });
}


  private loadEvents(): void {
  this.eventService.getAllEventsFull().subscribe({
    next: (res) => {
      console.log("🚀 Datos crudos del servicio:", res.data);

      const events = res.data;
      this.allEvents = events.map((e: any) => {
        const card = this.toCardItem(e);
        console.log("🟦 Tarjeta generada:", card);
        return card;
      });

      // Poblar opciones de tipo de evento
      this.populateTypeOptions();

      // Aplicar filtros iniciales
      this.applyFilters();
    },
    error: () => {
      this.snackbarService.showError("Error al cargar los eventos completos");
    }
  });
}


// Para convertir los datos del evento del API a CardItem y mostrarlos en las tarjetas
private toCardItem = (e: any): any => {
  const eventStart = e.eventStart ? new Date(e.eventStart) : undefined;
  const eventEnd = e.eventEnd ? new Date(e.eventEnd) : undefined;

  const dateLabel =
    eventStart && eventEnd
      ? `${eventStart.toLocaleDateString()} – ${eventEnd.toLocaleDateString()}`
      : eventStart?.toLocaleDateString();

  // ---------- Construimos tags como OBJETOS ----------
  const tagObjects: Array<{ label: string; color: string }> = [];

  // Estado
  if (e.statusName) {
    tagObjects.push({ label: e.statusName, color: '#a8d8ea' }); // Azul
  }

  // Tipo de evento
  if (e.eventTypeName) {
    tagObjects.push({ label: e.eventTypeName, color: '#b0c4de' }); // Gris
  }

  // Audiencias (perfil / unidad / división)
  (e.audiences ?? []).forEach((a: any) => {
    switch (a.typeId) {
      case 1: // Perfil
        tagObjects.push({ label: a.referenceName, color: '#f0f8ff' }); // Verde
        break;
      case 2: // Unidad organizativa
        tagObjects.push({ label: a.referenceName, color: '#d4a5c7' }); // Morado
        break;
      case 3: // División interna
        tagObjects.push({ label: a.referenceName, color: '#f7dc6f' }); // Naranja
        break;
    }
  });

  // ---------- Separamos visibles y extra ----------
  const visibles = tagObjects.slice(0, 3);
  const extras = tagObjects.length > 3 ? tagObjects.slice(3) : [];

  return {
    id: e.id,
    title: e.name ?? e.code ?? 'Evento',
    subtitle: e.eventTypeName ?? 'Evento',
    dateLabel,
    description: e.description ?? 'Sin descripción.',
    imageUrl:
      e.imageUrl ??
      'https://www.avilatinoamerica.com/images/stories/AVI/users/rsanta/16_tecnologias_basicas_para_un_auditorio.jpg',

    // 👇 ahora sí como espera generic-cards
    tags: visibles,           // [{ label, color }]
    fullTags: tagObjects,     // todas las tags
    showMoreCount: extras.length,

    isLocked: !(e.isPublic ?? e.ispublic ?? true),
    isDeleted: !!e.isDeleted,
    ...e
  };
};



  create() {
    this.router.navigate(['crear'], { relativeTo: this.route });
  }

  view(e: any) {
    this.openTagsModal(e);
  }

  edit(e: any) {
   
    this.router.navigate(['crear'], { relativeTo: this.route, queryParams: { id: e.id } });
  }

  remove(e: any) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar el evento "${e.title || e.name}"? Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.eventService.deleteEvent(e.id).subscribe({
          next: () => {
            this.snackbarService.showSuccess('Evento eliminado exitosamente');
            this.loadEvents();
          },
          error: (err) => {
            this.snackbarService.showError('Error al eliminar el evento');
          }
        });
      }
    });
  }

  toggle(e: any) {
    this.apiService.deleteLogic('Event', e.id).subscribe({
      next: () => {
        this.snackbarService.showSuccess(`Evento ${e.isDeleted ? 'activado' : 'desactivado'} exitosamente`);
        this.loadEvents();
      },
      error: (err) => {
        this.snackbarService.showError('Error al cambiar el estado del evento');
      }
    });
  }

  viewAttendees(e: any) {
    this.attendanceService.searchAttendance({
      eventId: e.id,
      sortBy: 'TimeOfEntry',
      sortDir: 'DESC',
      page: 1,
      pageSize: 20
    }).subscribe({
      next: (res) => {
        this.dialog.open(AttendanceModalComponent, {
          width: '80%',
          data: { eventName: e.title, attendances: res.items }
        });
      },
      error: () => {
        this.snackbarService.showError('Error al cargar los asistentes');
      }
    });
  }

  private populateTypeOptions(): void {
    const types = new Set(this.allEvents.map(e => e.eventTypeName).filter(t => t));
    this.typeOptions = ['Todos', ...Array.from(types)];
  }

  private applyFilters(): void {
    let filtered = [...this.allEvents];

    // Filtro por estado
    if (this.selectedStatus !== 'Todos') {
      const isActive = this.selectedStatus === 'Activo';
      filtered = filtered.filter(e => !e.isDeleted === isActive);
    }

    // Filtro por tipo
    if (this.selectedType !== 'Todos') {
      filtered = filtered.filter(e => e.eventTypeName === this.selectedType);
    }

    // Filtro por visibilidad
    if (this.selectedVisibility !== 'Todos') {
      const isPublic = this.selectedVisibility === 'Público';
      filtered = filtered.filter(e => e.isLocked !== isPublic); // isLocked es lo opuesto a isPublic
    }

    this.listEvents = filtered;
  }

  onStatusChange(value: string): void {
    this.selectedStatus = value;
    this.applyFilters();
  }

  onTypeChange(value: string): void {
    this.selectedType = value;
    this.applyFilters();
  }

  onVisibilityChange(value: string): void {
    this.selectedVisibility = value;
    this.applyFilters();
  }

}
