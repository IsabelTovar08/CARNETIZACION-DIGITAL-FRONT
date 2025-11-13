import { Component, OnInit } from '@angular/core';
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatChipsModule } from "@angular/material/chips";
import { GenericCardsComponent } from "../../../../shared/components/components-cards/generic-cards/generic-cards.component";
import { GenericListCardComponent } from "../../../../shared/components/generic-list-card/generic-list-card.component";
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../../core/Services/api/api.service';
import { SnackbarService } from '../../../../core/Services/snackbar/snackbar.service';
import { Event } from '../../../../core/Models/operational/event.model';
import { EventService } from '../../../../core/Services/api/event/event.service';
import { EventTagsModalComponent } from '../../../../shared/components/event-tags-modal/event-tags-modal.component';

@Component({
  selector: 'app-list-events',
  imports: [MatIconModule, MatMenuModule, MatChipsModule, GenericListCardComponent, MatButtonModule],
  templateUrl: './list-events.component.html',
  styleUrl: './list-events.component.css'
})
export class ListEventsComponent implements OnInit {
  listEvents: Event[] = []
  /**
   *
   */
  constructor(
    private apiService: ApiService<Event, Event>,
    private eventService: EventService,
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
      width: '420px',
      data: {
        title: e.title ?? e.name ?? 'Etiquetas del evento',
        tags: e.fullTags ?? []              // 👈 usamos lo que armamos en toCardItem
      }
    });
  }

  private loadEvents(): void {
  this.eventService.getAllEventsFull().subscribe({
    next: (res) => {
      console.log("🚀 Datos crudos del servicio:", res.data);

      const events = res.data;
      this.listEvents = events.map((e: any) => {
        const card = this.toCardItem(e);
        console.log("🟦 Tarjeta generada:", card);
        return card;
      });
    },
    error: () => {
      this.snackbarService.showError("Error al cargar los eventos completos");
    }
  });
}


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
    tagObjects.push({ label: e.statusName, color: '#2196F3' });
  }

  // Tipo
  if (e.eventTypeName) {
    tagObjects.push({ label: e.eventTypeName, color: '#9E9E9E' });
  }

  // Audiencias (perfil / unidad / división)
  (e.audiences ?? []).forEach((a: any) => {
    switch (a.typeId) {
      case 1:
        tagObjects.push({ label: a.referenceName, color: '#4CAF50' }); // Perfil
        break;
      case 2:
        tagObjects.push({ label: a.referenceName, color: '#8E24AA' }); // Unidad organizativa
        break;
      case 3:
        tagObjects.push({ label: a.referenceName, color: '#FB8C00' }); // División interna
        break;
    }
  });

  // ---------- Separamos visibles y extra ----------
  const visibles = tagObjects.slice(0, 3);
  const extras = tagObjects.length > 3 ? tagObjects.slice(3) : [];

  return {
    id: e.id,
    title: e.name ?? e.code ?? 'Evento',
    subtitle: e.eventTypeName,
    dateLabel,
    description: e.description ?? 'Sin descripción.',
    imageUrl:
      e.imageUrl ??
      'https://www.avilatinoamerica.com/images/stories/AVI/users/rsanta/16_tecnologias_basicas_para_un_auditorio.jpg',

    tags: visibles.map(t => t.label),    
    
    fullTags: tagObjects,                  
    showMoreCount: extras.length,

    ...e
  };
};


  create() {
    this.router.navigate(['crear'], { relativeTo: this.route });
  }

  view(e: any) {
   
  }

  edit(e: any) {
   
    this.router.navigate(['crear'], { relativeTo: this.route, queryParams: { id: e.id } });
  }

  remove(e: any) {
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

}
