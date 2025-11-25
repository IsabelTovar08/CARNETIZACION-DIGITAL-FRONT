import { Component, Inject, Input, OnInit } from '@angular/core';
import { HttpClient } from '@microsoft/signalr';
import { IssuedCardService } from '../../../core/Services/api/person/generic.service-PDF/issued-card.service';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
interface UserProfile {
  id: number;
  name: string;
  profile: string;
  categoryArea: string;
  phoneNumber: string;
  email: string;
  cardId: string;
  bloodTypeValue: string;
  companyName: string;
  branchName: string;
  branchEmail: string;
  branchPhone: string;
  branchAddress: string;
  address: string | null;
  title: string | null;
  userPhotoUrl: string;
  logoUrl: string;
  qrUrl: string;
  internalDivisionName: string;
  organizationalUnit: string;
  documentNumber: string;
  documentCode: string;
  documentName: string;
  uniqueId: string;
  frontTemplateUrl: string;
  backTemplateUrl: string;
  validFrom: string;
  validUntil: string;
  issuedDate: string;
}

@Component({
  selector: 'app-user-issued-card-info',
  imports: [CommonModule],
  templateUrl: './user-issued-card-info.component.html',
  styleUrl: './user-issued-card-info.component.css'
})
export class UserIssuedCardInfoComponent implements OnInit {
  issuedCardId!: number;

  userData: UserProfile | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private service: IssuedCardService,
    @Inject(MAT_DIALOG_DATA) public data: { issuedCardId: number },
    public dialogRef: MatDialogRef<UserIssuedCardInfoComponent>
  ) {
    if (data && data.issuedCardId) {
      this.issuedCardId = data.issuedCardId;
    }
  }

  ngOnInit(): void {
    console.log(this.issuedCardId)

    if (this.issuedCardId) {
      this.loadUserData();
    } else {
      this.error = 'No se proporcionó un ID de usuario válido';
    }
  }

  loadUserData(): void {
    this.loading = true;
    this.error = null;

    this.service.getinfoUser(this.issuedCardId)
      .subscribe({
        next: (data) => {
          this.userData = data.data;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error al cargar los datos del usuario';
          this.loading = false;
          console.error('Error:', err);
        }
      });
  }

  verCarnet(item: any): void {
    this.service.getCardPdf(item.id).subscribe({
      next: (blob) => {
        this.openPdf(blob);
      },
      error: (err) => {
        console.error('Error generating PDF:', err);
      }
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

  formatDate(dateString: string): string {
    if (!dateString || dateString.startsWith('0001')) {
      return 'No disponible';
    }
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  onImageError(event: any): void {
    // event.target.src = 'assets/default-avatar.png';
  }

  onLogoError(event: any): void {
    event.target.style.display = 'none';
  }



}
