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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-jornadas',
  imports: [GenericTableComponent, CommonModule],
  templateUrl: './working-day.component.html',
  styleUrl: './working-day.component.css'
})
export class JornadasComponent {
  myForm: FormGroup;
  listSchedule!: ScheduleList[];
  displayedColumns: string[] = ['name', 'startTime', 'endTime', 'isDeleted', 'actions'];
  daysOptions = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];


  constructor(private apiService: ApiService<ScheduleCreate, ScheduleList>,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private listService: ListService
  ) {
    this.myForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.cargarJornadas();
  };

  cargarJornadas() {
    this.apiService.ObtenerTodo('Schedule').subscribe({
      next: (res) => {
        this.listSchedule = res.data || [];
      },
      error: () => this.snackbarService.showError('Error al cargar las jornadas')
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
        title: item ? 'Editar Jornada' : 'Crear Jornada',
        item,
        fields: [
          { name: 'name', label: 'Nombre', type: 'text', value: item?.name || '', required: true },
          { name: 'startTime', label: 'Hora inicio', type: 'time', value: fromApiTime(item?.startTime || ''), required: true },
          { name: 'endTime', label: 'Hora fin', type: 'time', value: fromApiTime(item?.endTime || ''), required: true },
          ...this.daysOptions.map(day => ({
            label: day,
            type: 'checkbox',
            value: day,
            checked: false // luego ajustamos si necesitas persistir días
          }))
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


  add(schedule: any, id?: number) {
  const payload: ScheduleCreate = {
    name: schedule.name,
    description: "",
    startTime: this.toHms(schedule.startTime),
    endTime: this.toHms(schedule.endTime)
  };

  if (id) {
    this.apiService.update('Schedule', { ...payload, id }).subscribe(() => {
      this.recargarLista();
      this.snackbarService.showSuccess('Jornada actualizada con éxito');
    });
  } else {
    this.apiService.Crear('Schedule', payload).subscribe(() => {
      this.recargarLista();
      this.snackbarService.showSuccess('Jornada creada con éxito');
    });
  }
}

private toHms(time: string): string {
  return time && time.length === 5 ? time + ":00" : time || "00:00:00";
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
