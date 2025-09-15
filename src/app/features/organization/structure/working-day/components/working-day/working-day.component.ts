import { Component } from '@angular/core';
import { ApiService } from '../../../../../../core/Services/api/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from '../../../../../../core/Services/snackbar/snackbar.service';
import { ListService } from '../../../../../../core/Services/shared/list.service';
import { ScheduleCreate, ScheduleList } from '../../../../../../core/Models/organization/schedules.models';
import { GenericTableComponent } from '../../../../../../shared/components/generic-table/generic-table.component';
import { CommonModule } from '@angular/common';
import { GenericFormComponent } from '../../../../../../shared/components/generic-form/generic-form.component';
import { fromApiTime } from '../../../../../../core/utils/time-only';

@Component({
  selector: 'app-jornadas',
  imports: [GenericTableComponent, CommonModule],
  templateUrl: './working-day.component.html',
  styleUrl: './working-day.component.css'
})
export class JornadasComponent {
  listSchedule!: ScheduleList[];
  displayedColumns: string[] = ['name', 'startTime', 'endTime', 'isDeleted', 'actions'];

  constructor(private apiService: ApiService<ScheduleCreate, ScheduleList>,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private listService: ListService
  ) { }

  ngOnInit(): void {
    this.cargarData(false);
    this.route.url.subscribe(segments => {
      const isCreate = segments.some(s => s.path === 'create');
      if (isCreate) {
        this.openModal();
      }
    });
  }

  cargarData(reload: boolean) {
    this.apiService.ObtenerTodo('Schedule').subscribe(data => 
      this.listSchedule = data.data
    );
  }

  recargarLista() {
    this.cargarData(true)
  }

  openModal(item?: ScheduleList) {
    const dialogRef = this.dialog.open(GenericFormComponent, {
      disableClose: true,
      width: '400px',
      data: {
        title: item ? 'Editar' : 'Crear',
        item,
        fields: [
          { name: 'startTime', label: 'Hora inicio', type: 'time', value: fromApiTime(item?.startTime || ''), required: true },
          { name: 'endTime', label: 'Hora fin', type: 'time', value: fromApiTime(item?.endTime || ''), required: true },

        ],
        replaceBaseFields: true
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (item) {
          this.add(result, item.id);
        } else {
          this.add(result);
        }
      }

      this.router.navigate(['./'], { relativeTo: this.route });
    });
  }


  add(schedule: ScheduleCreate, id?: number) {
    if (id) {
      this.apiService.update('Deparment', schedule).subscribe(() => {
        this.recargarLista();
        this.snackbarService.showSuccess();
      })
    }
    else {
      this.apiService.Crear('Schedule', schedule).subscribe(() => {
        this.recargarLista();
        this.snackbarService.showSuccess();
      })
    }
  }

  save(data?: ScheduleList) {
    this.openModal(data)
  }

  delete(item: any) {
    this.apiService.delete("Schedule", item.id).subscribe(() => {
      this.snackbarService.showSuccess('Jornada eliminada con éxito')
      this.recargarLista();
    })
  }

  toggleIsActive(item: any) {
    this.apiService.deleteLogic('Schedule', item.id).subscribe(() => {
      this.snackbarService.showSuccess("Jornada actualizada con éxito");
      this.recargarLista();
    })
  }
}
