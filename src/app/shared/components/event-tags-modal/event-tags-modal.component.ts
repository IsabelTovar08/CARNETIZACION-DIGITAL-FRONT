import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { EventService } from '../../../core/Services/api/event/event.service';

interface EventSupervisorDtoResponse {
  id: number;
  eventId: number;
  eventName?: string;
  userId: number;
  fullName?: string;
  userEmail?: string;
}

interface EventDetailsDtoResponse {
  id: number;
  name: string;
  code: string;
  subtitle?: string;
  description?: string;
  eventStart: string;
  eventEnd: string;
  dateLabel?: string;
  eventTypeId: number;
  eventTypeName: string;
  statusId: number;
  statusName: string;
  imageUrl?: string;
  qrCodeBase64?: string;

  supervisors: EventSupervisorDtoResponse[];

  audiences?: any[];
  tags?: any[];
  fullTags?: any[];
  accessPoints?: any[];
  schedules?: any[];
}

@Component({
  selector: 'app-event-tags-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatChipsModule
  ],
  templateUrl: './event-tags-modal.component.html',
  styleUrl: './event-tags-modal.component.css'
})
export class EventTagsModalComponent {

  event!: EventDetailsDtoResponse;
  enlargedQr: string | null = null;

  private pastelColors = [
    '#a8d8ea', '#b0c4de', '#d3d3d3', '#f7dc6f',
    '#d4a5c7', '#b8e6d4', '#e6e6fa', '#f0f8ff'
  ];

 constructor(
  @Inject(MAT_DIALOG_DATA) public data: { event: EventDetailsDtoResponse  },
  private eventService: EventService
) {
  this.event = data.event;

  if (!this.event.supervisors) {
      this.event.supervisors = [];
    }
    console.log("🟦 EVENTO COMPLETO EN MODAL", this.event);
    console.log("👥 SUPERVISORES", this.event.supervisors);
}

  // // ========= CARGAR DETALLES DEL EVENTO ==========
  //  private loadEvent(): void {
  //   this.eventService.getEventDetails(this.data.eventId).subscribe({
  //     next: (r) => {
  //       this.event = r.data;
  //       console.log("🟦 EVENTO COMPLETO", this.event);
  //     },
  //     error: (err) => {
  //       console.error("❌ Error cargando detalles del evento:", err);
  //     }
  //   });
  // }

  // ========= TAGS ==========
  private darkenColor(hex: string, percent: number): string {
    const num = parseInt(hex.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;

    return "#" + (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1);
  }

  getTagStyle(tag: any): any {
    const color = tag.color;
    const darkerColor = this.darkenColor(color, 30);

    return {
      background: color + '40',
      border: `1px solid ${darkerColor}`,
      color: darkerColor
    };
  }

  // ========= TIPOS DE PUNTO ==========
  getAccessPointType(typeId: number): string {
    switch (typeId) {
      case 1: return 'Entrada';
      case 2: return 'Salida';
      case 3: return 'Mixto';
      default: return 'Desconocido';
    }
  }

  // ========= QR ==========
  enlargeQr(qrCode: string | undefined) {
    this.enlargedQr = qrCode || null;
  }

  downloadQr(base64: string | undefined, filename: string | undefined) {
    if (!base64 || !filename) return;
    const link = document.createElement('a');
    link.href = 'data:image/png;base64,' + base64;
    link.download = filename;
    link.click();
  }
}
