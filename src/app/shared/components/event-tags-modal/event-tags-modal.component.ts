// event-tags-modal.component.ts
import { Component, Inject, OnInit, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { EventService } from '../../../core/Services/api/event/event.service';
import * as QRCode from 'qrcode';
import { MatProgressSpinner } from "@angular/material/progress-spinner"; // ✅ IMPORTAR

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
    MatChipsModule,
    MatProgressSpinner
],
  templateUrl: './event-tags-modal.component.html',
  styleUrl: './event-tags-modal.component.css'
})
export class EventTagsModalComponent implements AfterViewInit {

  event!: EventDetailsDtoResponse;
  enlargedQr: string | null = null;
  
  // ✅ Guardar URLs de los QR generados
  qrDataUrls: { [key: string]: string } = {};

  private pastelColors = [
    '#a8d8ea', '#b0c4de', '#d3d3d3', '#f7dc6f',
    '#d4a5c7', '#b8e6d4', '#e6e6fa', '#f0f8ff'
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { event: EventDetailsDtoResponse },
    private eventService: EventService
  ) {
    this.event = data.event;

    if (!this.event.supervisors) {
      this.event.supervisors = [];
    }
    console.log("🟦 EVENTO COMPLETO EN MODAL", this.event);
    console.log("👥 SUPERVISORES", this.event.supervisors);
  }

  ngAfterViewInit(): void {
    // ✅ Generar todos los QR después de que el DOM esté listo
    this.generateAllQRCodes();
  }

  // ========= GENERAR QR CODES ==========
  async generateAllQRCodes(): Promise<void> {
    if (!this.event.accessPoints?.length) return;

    for (const ap of this.event.accessPoints) {
      if (ap.qrCodeKey) {
        await this.generateQRCode(ap.qrCodeKey);
      }
    }
  }

  async generateQRCode(qrCodeKey: string): Promise<void> {
    try {
      // ✅ Generar QR como Data URL (base64)
      const dataUrl = await QRCode.toDataURL(qrCodeKey, {
        width: 200,
        margin: 2,
        errorCorrectionLevel: 'M',
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      this.qrDataUrls[qrCodeKey] = dataUrl;
    } catch (error) {
      console.error('Error generando QR:', error);
    }
  }

  // ========= AMPLIAR QR ==========
  async enlargeQr(qrData: string | undefined): Promise<void> {
    if (!qrData) return;

    try {
      // ✅ Generar versión de alta calidad para ampliar
      const dataUrl = await QRCode.toDataURL(qrData, {
        width: 500,
        margin: 3,
        errorCorrectionLevel: 'H',
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      this.enlargedQr = dataUrl;
    } catch (error) {
      console.error('Error ampliando QR:', error);
    }
  }

  // ========= DESCARGAR QR ==========
  async downloadQr(qrData: string | undefined, filename: string | undefined): Promise<void> {
    if (!qrData || !filename) return;

    try {
      // ✅ Generar QR de alta resolución
      const dataUrl = await QRCode.toDataURL(qrData, {
        width: 600,
        margin: 4,
        errorCorrectionLevel: 'H'
      });

      // Crear link de descarga
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = this.sanitizeFilename(filename);
      link.click();
    } catch (error) {
      console.error('Error descargando QR:', error);
    }
  }

  // ========= IMPRIMIR QR ==========
  async printQr(qrCodeKey: string, apName: string): Promise<void> {
    try {
      // ✅ Generar QR para impresión
      const dataUrl = await QRCode.toDataURL(qrCodeKey, {
        width: 600,
        margin: 4,
        errorCorrectionLevel: 'H'
      });

      const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>QR - ${apName}</title>
          <style>
            @page { margin: 2cm; }
            body { 
              font-family: Arial, sans-serif;
              text-align: center;
              padding: 2rem;
            }
            h1 { font-size: 1.8rem; margin-bottom: 1rem; }
            .subtitle { color: #666; margin-bottom: 2rem; font-size: 1.1rem; }
            img { 
              border: 4px solid #ddd; 
              border-radius: 8px;
              margin: 2rem 0;
              max-width: 400px;
            }
            .code { 
              font-family: 'Courier New', monospace;
              font-size: 0.85rem;
              color: #999;
              word-break: break-all;
              margin-top: 2rem;
              padding: 1rem;
              background: #f5f5f5;
              border-radius: 4px;
              max-width: 500px;
              margin-left: auto;
              margin-right: auto;
            }
          </style>
        </head>
        <body>
          <h1>${this.event.name}</h1>
          <p class="subtitle">Punto de acceso: ${apName}</p>
          <img src="${dataUrl}" />
          <div class="code">${qrCodeKey}</div>
        </body>
        </html>
      `;

      const printWindow = window.open('', '', 'width=800,height=800');
      if (printWindow) {
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.print();
      }
    } catch (error) {
      console.error('Error imprimiendo QR:', error);
    }
  }

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

  // ========= UTILIDADES ==========
  private sanitizeFilename(name: string): string {
    return name.replace(/[^a-z0-9._-]/gi, '_').toLowerCase();
  }

  closeEnlargedQr(): void {
    this.enlargedQr = null;
  }
}