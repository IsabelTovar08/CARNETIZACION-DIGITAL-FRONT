import { Component } from '@angular/core';
import { GenericTableComponent } from "../../../../shared/components/generic-table/generic-table.component";
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../../../core/Services/api/api.service';
import { SnackbarService } from '../../../../core/Services/snackbar/snackbar.service';
import { GenericFormComponent } from '../../../../shared/components/generic-form/generic-form.component';
import { EventType } from '../../../../core/Models/operational/event.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-event-types',
  imports: [GenericTableComponent, CommonModule],
  templateUrl: './list-event-types.component.html',
  styleUrl: './list-event-types.component.css'
})
export class ListEventTypesComponent {
  listEventType!: EventType[];
  displayedColumns: string[] = ['name', 'description', 'isDeleted', 'actions'];

  constructor(private apiService: ApiService<EventType, EventType>,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
  ) { }

  ngOnInit(): void {
    this.cargarData();
    this.route.url.subscribe(segments => {
      const isCreate = segments.some(s => s.path === 'create');
      if (isCreate) {
        this.openModal();
      }
    });
  }

  cargarData() {
    this.apiService.ObtenerTodo('EventType').subscribe((data) => {
      this.listEventType = data.data as EventType[]
    })
  }

  openModal(item?: EventType) {
    const dialogRef = this.dialog.open(GenericFormComponent, {
      disableClose: true,
      width: '400px',
      data: {
        title: item ? 'Editar' : 'Crear',
        item
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (item) {
          this.add(result, item.id);
        } else {
          this.add(result);
        }
      }

      // 🔙 Vuelve a la ruta base sin /create
      this.router.navigate(['./'], { relativeTo: this.route });
    });
  }


  add(EventType: EventType, id?: number) {
    if (id) {
      this.apiService.update('EventType', EventType).subscribe(() => {
        this.cargarData();
        this.snackbarService.showSuccess();
      })
    }
    else {
      this.apiService.Crear('EventType', EventType).subscribe(() => {
        this.cargarData();
        this.snackbarService.showSuccess();
      })
    }
  }

  save(data?: EventType) {
    this.openModal(data)
  }

  delete(item: any) {
    this.apiService.delete("EventType", item.id).subscribe(() => {
      this.snackbarService.showInfo('Permiso eliminado con éxito')
      this.cargarData();
    })
  }

  toggleIsActive(item: any) {
    this.apiService.deleteLogic('EventType', item.id).subscribe(() => {
      this.snackbarService.showSuccess("Estado actualizado con éxito");
    })
  }
}
