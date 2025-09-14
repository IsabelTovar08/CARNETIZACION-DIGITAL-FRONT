import { Component } from '@angular/core';
import { Status } from '../../../../core/Models/parameter/status.models';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../../core/Services/api/api.service';
import { DataService } from '../../../../core/Services/shared/data.service';
import { SnackbarService } from '../../../../core/Services/snackbar/snackbar.service';
import { GenericFormComponent } from '../../../../shared/components/generic-form/generic-form.component';
import { GenericTableComponent } from "../../../../shared/components/generic-table/generic-table.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status-list',
  imports: [GenericTableComponent, CommonModule],
  templateUrl: './status-list.component.html',
  styleUrl: './status-list.component.css'
})
export class StatusListComponent {
  listStatus!: Status[];


  constructor(private apiService: ApiService<Status, Status>,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private dataService: DataService,

  ) { }

  ngOnInit(): void {
    this.cargarData();
  }

  displayedColumns: string[] = ['name', 'isDeleted', 'actions'];

  cargarData() {
    this.apiService.ObtenerTodo('Status').subscribe((data) => {
      this.listStatus = data.data as Status[];
    })
  }



  openModal(item?: Status) {
      const dialogRef = this.dialog.open(GenericFormComponent, {
        disableClose: true,
        width: '400px',
        data: {
          title: item ? 'Editar' : 'Crear',
          item,
          fields: [
            { name : 'id', value: item?.id || 0, hidden: true },
            { name: 'name', label: 'Nombre', type: 'string', value: item?.name || '', required: true },

          ],
          replaceBaseFields: true
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          item ? this.add(result, item.id) : this.add(result);
        }
        this.router.navigate(['./'], { relativeTo: this.route });
      });
  }



  add(Status: Status, id?: number) {
    if (id) {
      this.apiService.update('Status', Status).subscribe(() => {
        this.cargarData();
        this.snackbarService.showSuccess();
      })
    }
    else {
      this.apiService.Crear('Status', Status).subscribe(() => {
        this.cargarData();
        this.snackbarService.showSuccess();
      })
    }
  }

  save(data?: Status) {
    this.openModal(data)
  }

  delete(item: any) {
    this.apiService.delete("Status", item.id).subscribe(() => {
      this.snackbarService.showInfo('Estado eliminado con éxito')
      this.cargarData();
    })
  }
  toggleIsActive(item: any) {
    this.apiService.deleteLogic('Status', item.id).subscribe(() => {
      this.snackbarService.showSuccess("Estado actualizado con éxito");
    })
  }
}
