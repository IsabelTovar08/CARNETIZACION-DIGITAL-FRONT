import { AccessPointDto } from './../../../../core/Models/operational/event.model';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericListCardComponent } from "../../../../shared/components/generic-list-card/generic-list-card.component";
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../../core/Services/api/api.service';
import { SnackbarService } from '../../../../core/Services/snackbar/snackbar.service';
import { EventTagsModalComponent } from '../../../../shared/components/event-tags-modal/event-tags-modal.component';

@Component({
  selector: 'app-list-access-point',
  imports: [CommonModule, GenericListCardComponent, MatDialogModule],
  templateUrl: './list-access-point.component.html',
  styleUrl: './list-access-point.component.css'
})
export class ListAccessPointComponent {
  accessPoints: AccessPointDto[] = [];

  cards: any[] = [];
  enlargedQr: string | null = null;

  constructor(
    private apiService: ApiService<AccessPointDto, AccessPointDto>,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
  ) { }
  ngOnInit(): void {
    this.apiService.ObtenerTodo('AccessPoint').subscribe((data) => {
      this.accessPoints = data.data as AccessPointDto[];
    })
  }

  enlargeQr(qrCode: string) {
    this.enlargedQr = qrCode;
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
