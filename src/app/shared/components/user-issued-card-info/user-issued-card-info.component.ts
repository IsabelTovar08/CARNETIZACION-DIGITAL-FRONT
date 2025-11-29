import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { IssuedCardService } from '../../../core/Services/api/person/generic.service-PDF/issued-card.service';
import { ViewDatePersonCarnetService } from '../../../core/Services/api/person/ViewDatePersonCarnet/ViewDatePersonCarnet.service';
import { MatIcon } from "@angular/material/icon";

interface UserProfile {
  id: number;
  name: string;
  phoneNumber: string;
  email: string;
  documentNumber: string;
  bloodTypeValue: string;
  address: string | null;

  profile: string;
  categoryArea: string;
  companyName: string;
  internalDivisionName: string;
  organizationalUnit: string;
  userPhotoUrl: string;
  logoUrl: string;
  validFrom: string;
  validUntil: string;
  issuedDate: string;
}

@Component({
  selector: 'app-user-issued-card-info',
  imports: [CommonModule, MatExpansionModule, MatIcon],
  templateUrl: './user-issued-card-info.component.html',
  styleUrl: './user-issued-card-info.component.css'
})
export class UserIssuedCardInfoComponent implements OnInit {

  issuedCardId!: number;
  personId!: number;

  isCardView = false;
  isPersonView = false;

  loading = false;
  error: string | null = null;

  userData: UserProfile | null = null;

  cardsList: any[] = [];
  modifications: any[] = [];

  constructor(
    private service: IssuedCardService,
    private viewDateService: ViewDatePersonCarnetService,
    @Inject(MAT_DIALOG_DATA) public data: { issuedCardId?: number; personId?: number },
    public dialogRef: MatDialogRef<UserIssuedCardInfoComponent>
  ) { }

  ngOnInit(): void {
    if (this.data?.issuedCardId) {
      this.issuedCardId = this.data.issuedCardId;
      this.isCardView = true;
      this.loadDataByIssuedCardId();
    } else if (this.data?.personId) {
      this.personId = this.data.personId;
      this.isPersonView = true;
      this.loadPersonFullData();
    } else {
      this.error = "No se proporcionaron datos.";
    }
  }

  /* ===========================
     LOAD DATA – ISSUED CARD
  ============================ */
    loadDataByIssuedCardId(): void {
    this.loading = true;

    // ✅ Usa el endpoint correcto para issuedCardId
    this.service.getCardDataByIssuedId(this.issuedCardId).subscribe({
      next: (resp: any) => {
        this.userData = resp.data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar carnet:', err);
        this.error = "Error al cargar la información del carnet.";
        this.loading = false;
      }
    });
  }

  /* ===========================
     LOAD DATA – PERSON
  ============================ */
    loadPersonFullData(): void {
    this.loading = true;
    console.log('Cargando datos para personId:', this.personId);

    // ✅ Obtener TODOS los carnets del usuario
    this.service.getCardsByUser(this.personId).subscribe({
      next: (response: any) => {
        console.log('Respuesta getCardsByUser:', response);
        this.cardsList = response.data || [];
        
        // ✅ Usar el primer carnet para mostrar info general
        if (this.cardsList.length > 0) {
          const firstCard = this.cardsList[0];
          
          // ✅ Ahora obtén los datos completos del PRIMER carnet
          this.service.getCardDataByIssuedId(firstCard.id).subscribe({
            next: (detailResponse: any) => {
              this.userData = detailResponse.data;
              console.log('Datos de usuario asignados:', this.userData);
              this.loading = false;
            },
            error: (err) => {
              console.error('Error al cargar datos completos:', err);
              this.error = "Error al cargar la información completa.";
              this.loading = false;
            }
          });
        } else {
          this.error = "No se encontraron carnets para este usuario.";
          this.loading = false;
        }
      },
      error: (err) => {
        console.error('Error al cargar carnets:', err);
        this.cardsList = [];
        this.error = "Error al cargar los carnets del usuario.";
        this.loading = false;
      }
    });

    // ✅ Cargar solicitudes de modificación
    this.viewDateService.getModificationsByUser(this.personId).subscribe({
      next: (response: any) => {
        console.log('Modificaciones:', response);
        this.modifications = response.data || [];
      },
      error: (err) => {
        console.error('Error al cargar modificaciones:', err);
        this.modifications = [];
      }
    });
  }

    verCarnet(item: any): void {
    // ✅ Asegúrate de usar el ID correcto del carnet
    const cardId = item.id || item.issuedCardId;
    if (!cardId) {
      console.error('No se encontró ID del carnet');
      return;
    }

    this.service.getCardPdf(cardId).subscribe({
      next: (blob: Blob) => {
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
      },
      error: (err) => {
        console.error('Error al generar PDF:', err);
      }
    });
  }

  openPdf(blob: Blob): void {
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  }

  formatDate(date: string): string {
    if (!date || date.startsWith("0001")) return "No disponible";
    return new Date(date).toLocaleDateString("es-ES");
  }

  onImageError(e: any): void {
    // e.target.src = 'assets/default-avatar.png';
  }

  onLogoError(e: any): void {
    e.target.style.display = 'none';
  }

  getStatusClass(status: string): string {
    if (!status) return 'unknown';

    const statusLower = status.toLowerCase();

    switch (statusLower) {
      case 'pending':
      case 'pendiente':
        return 'pending';
      case 'approved':
      case 'aprobado':
      case 'aceptado':
        return 'approved';
      case 'rejected':
      case 'rechazado':
      case 'denegado':
        return 'rejected';
      case 'in_progress':
      case 'en_progreso':
      case 'progreso':
        return 'in-progress';
      default:
        return 'unknown';
    }
  }
}
