import { AccessPointDto } from './../../../../core/Models/operational/event.model';
import { Component } from '@angular/core';
import { GenericListCardComponent } from "../../../../shared/components/generic-list-card/generic-list-card.component";
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../../core/Services/api/api.service';
import { SnackbarService } from '../../../../core/Services/snackbar/snackbar.service';

@Component({
  selector: 'app-list-access-point',
  imports: [GenericListCardComponent],
  templateUrl: './list-access-point.component.html',
  styleUrl: './list-access-point.component.css'
})
export class ListAccessPointComponent {
  accessPoints: AccessPointDto[] = [];

  cards: any[] = [];
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

  // acciones
  create() { }
  view(item: any) { }
  edit(item: any) {  }
  remove(item: any) { }
  toggle(item: any) { }
}
