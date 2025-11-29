import { AccessPointDto } from './../../../../core/Models/operational/event.model';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericListCardComponent } from "../../../../shared/components/generic-list-card/generic-list-card.component";
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import * as QRCode from 'qrcode';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../../core/Services/api/api.service';
import { SnackbarService } from '../../../../core/Services/snackbar/snackbar.service';
import { EventTagsModalComponent } from '../../../../shared/components/event-tags-modal/event-tags-modal.component';
import { EventService } from '../../../../core/Services/api/event/event.service';

@Component({
  selector: 'app-list-access-point',
  imports: [CommonModule, GenericListCardComponent, MatDialogModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './list-access-point.component.html',
  styleUrl: './list-access-point.component.css'
})
export class ListAccessPointComponent {
  accessPoints: AccessPointDto[] = [];

  cards: any[] = [];
  enlargedQr: string | null = null;

  // ✅ Cache para QR generados
  qrUrls: { [key: string]: string } = {};

  constructor(
    private apiService: ApiService<AccessPointDto, AccessPointDto>,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private eventService: EventService,
  ) { }
  ngOnInit(): void {
    this.apiService.ObtenerTodo('AccessPoint').subscribe((data) => {
      this.accessPoints = data.data as AccessPointDto[];
    })
  }

  // ========= GENERAR QR ==========
  async generateQR(qrCodeKey: string): Promise<void> {
    try {
      // ✅ Generar QR como Data URL (base64)
      const dataUrl = await QRCode.toDataURL(qrCodeKey, {
        width: 150,
        margin: 2,
        errorCorrectionLevel: 'M',
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      this.qrUrls[qrCodeKey] = dataUrl;
    } catch (error) {
      console.error('Error generando QR:', error);
    }
  }

  // ========= OBTENER URL DEL QR ==========
  getQrUrl(qrCodeKey: string): string {
    if (this.qrUrls[qrCodeKey]) {
      return this.qrUrls[qrCodeKey];
    }

    // Si no tenemos la URL, la generamos
    if (qrCodeKey) {
      this.generateQR(qrCodeKey);
    }

    return ''; // Retornamos vacío mientras se carga
  }

  // ========= AMPLIAR QR ==========
  async enlargeQr(qrCodeKey: string): Promise<void> {
    if (!qrCodeKey) return;

    try {
      // ✅ Generar versión de alta calidad para ampliar
      const dataUrl = await QRCode.toDataURL(qrCodeKey, {
        width: 400,
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

  // acciones
  create() { }
  view(item: any) {
    this.dialog.open(EventTagsModalComponent, {
      width: '520px',
      data: {
        title: item.name,
        description: item.description,
        accessPoints: [item] // Pasar el punto de acceso como array
      }
    });
  }
  edit(item: any) {  }
  remove(item: any) { }
  toggle(item: any) { }
}
