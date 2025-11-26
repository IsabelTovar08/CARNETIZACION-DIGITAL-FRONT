import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { IssuedCardService } from '../../../core/Services/api/person/generic.service-PDF/issued-card.service';

interface UserProfile {
  id: number;
  name: string;
  phoneNumber: string;
  email: string;
  documentNumber: string;
  bloodTypeValue: string;
  address: string | null;

  /* CAMPOS SOLO DE CARNET */
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
  imports: [CommonModule, MatExpansionModule],
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

  /* Dummy */
  cardsList: any[] = [];
  modifications: any[] = [];

  constructor(
    private service: IssuedCardService,
    @Inject(MAT_DIALOG_DATA) public data: { issuedCardId?: number; personId?: number },
    public dialogRef: MatDialogRef<UserIssuedCardInfoComponent>
  ) { }

  ngOnInit(): void {

    if (this.data?.issuedCardId) {
      this.issuedCardId = this.data.issuedCardId;
      this.isCardView = true;
      this.loadUserData();
    }
    else if (this.data?.personId) {
      this.personId = this.data.personId;
      this.isPersonView = true;
      this.loadPersonFullData();
    }
    else {
      this.error = "No se proporcionaron datos.";
    }
  }


  /* ===========================
     LOAD DATA – ISSUED CARD
  ============================ */
  loadUserData(): void {
    this.loading = true;

    this.service.getinfoUser(this.issuedCardId).subscribe({
      next: (response) => {
        this.userData = response.data;
        this.loading = false;
      },
      error: () => {
        this.error = "Error al cargar la información.";
        this.loading = false;
      }
    });
  }


  /* ===========================
     LOAD DATA – PERSON
  ============================ */
  loadPersonFullData(): void {
    this.loading = true;

    /* Dummy data — Replace when API ready */
    this.userData = {
      id: this.personId,
      name: "Juan Pérez",
      phoneNumber: "3214567890",
      email: "juan@example.com",
      documentNumber: "1023456789",
      bloodTypeValue: "A+",
      address: "Calle 10 # 20 - 30",

      /* Campos de carnet no usados aquí */
      profile: "",
      categoryArea: "",
      companyName: "",
      internalDivisionName: "",
      organizationalUnit: "",
      userPhotoUrl: "assets/default-avatar.png",
      logoUrl: "",
      validFrom: "",
      validUntil: "",
      issuedDate: ""
    };

    this.cardsList = [
      { id: 21, profileName: "Empleado", internalDivisionName: "Sistemas", issuedDate: "2024-01-10", validUntil: "2025-01-10" },
      { id: 19, profileName: "Contratista", internalDivisionName: "Talento Humano", issuedDate: "2023-03-15", validUntil: "2024-03-15" }
    ];

    this.modifications = [
      { id: 1, field: "Correo", old: "old@mail.com", new: "nuevo@mail.com", date: "2024-02-10" },
      { id: 2, field: "Teléfono", old: "3110000", new: "3200000", date: "2024-03-12" }
    ];

    this.loading = false;
  }


  verCarnet(item: any): void {
    this.service.getCardPdf(item.id).subscribe(blob => this.openPdf(blob));
  }

  openPdf(blob: Blob): void {
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  }

  formatDate(date: string): string {
    if (!date || date.startsWith("0001")) return "No disponible";
    return new Date(date).toLocaleDateString("es-ES");
  }

  onImageError(e: any) {
    // e.target.src = 'assets/default-avatar.png';
  }

  onLogoError(e: any) {
    e.target.style.display = 'none';
  }
}
