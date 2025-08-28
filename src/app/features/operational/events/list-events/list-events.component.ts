import { Component, OnInit } from '@angular/core';
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { GenericCardsComponent } from "../../../../shared/components/components-cards/generic-cards/generic-cards.component";
import { GenericListCardComponent } from "../../../../shared/components/generic-list-card/generic-list-card.component";
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../../core/Services/api/api.service';
import { SnackbarService } from '../../../../core/Services/snackbar/snackbar.service';
import { Event } from '../../../../core/Models/operational/event.model';

@Component({
  selector: 'app-list-events',
  imports: [MatIconModule, MatMenuModule, GenericListCardComponent, MatButtonModule],
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
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
  ) {

  }
  ngOnInit(): void {
    this.apiService.ObtenerTodo('Event').subscribe((data) => {
      this.listEvents = data.data as Event[];
      this.listEvents = this.listEvents.map(this.toCardItem);
    })
  }

  private toCardItem = (e: any): any => {
    const eventStart = e.eventStart ? new Date(e.eventStart) : undefined;
    const eventEnd = e.eventEnd ? new Date(e.eventEnd) : undefined;
    const scheduleDate = e.scheduleDate ? new Date(e.scheduleDate) : undefined;
    const scheduleTime = e.scheduleTime ? new Date(e.scheduleTime) : undefined;

    const dateLabel =
      eventStart && eventEnd
        ? `${eventStart.toLocaleDateString()} – ${eventEnd.toLocaleDateString()}`
        : scheduleDate
          ? scheduleTime
            ? `${scheduleDate.toLocaleDateString()} ${scheduleTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
            : scheduleDate.toLocaleDateString()
          : undefined;

    return {
      id: e.id ?? e.code,
      title: e.name ?? e.code ?? 'Evento',
      subtitle: e.eventTypeName ?? 'Evento',
      dateLabel,
      imageUrl: e.imageUrl ?? 'https://www.avilatinoamerica.com/images/stories/AVI/users/rsanta/16_tecnologias_basicas_para_un_auditorio.jpg',
      description: e.description ?? 'Sin descripción.',
      tags: [(e.statusName ?? 'Sin estado'), (e.eventTypeName ?? 'General')].filter(Boolean),
      isLocked: !(e.isPublic ?? e.ispublic ?? true),
      isDeleted: !!e.isDeleted,
      ...e
    };
  };

  create() {  }
  view(e: any) { }
  edit(e: any) { }
  remove(e: any) { }
  toggle(e: any) { }

}
