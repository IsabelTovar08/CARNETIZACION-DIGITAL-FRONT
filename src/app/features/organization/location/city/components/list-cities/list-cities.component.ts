import { Component } from '@angular/core';
import { GenericTableComponent } from "../../../../../../shared/components/generic-table/generic-table.component";
import { CityList, Deparment } from '../../../../../../core/Models/parameter/ubication.models';
import { ApiService } from '../../../../../../core/Services/api/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from '../../../../../../core/Services/snackbar/snackbar.service';
import { ListService } from '../../../../../../core/Services/shared/list.service';
import { GenericFormComponent } from '../../../../../../shared/components/generic-form/generic-form.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-cities',
  imports: [GenericTableComponent, CommonModule],
  templateUrl: './list-cities.component.html',
  styleUrl: './list-cities.component.css'
})
export class ListCitiesComponent {
  listCityList: CityList[] = [];
  listDeparment: Deparment[] = [];
  displayedColumns: string[] = ['name', 'deparmentName', 'isDeleted', 'actions'];


  constructor(private apiService: ApiService<CityList, CityList>,
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
    this.cargarDeparments(true)
  }

  cargarDeparments(reload: boolean) {
    this.listService.getdeparments(reload).subscribe(data => this.listDeparment = data);
  }

  cargarData(reload: boolean) {
    this.listService.getCities(reload).subscribe(data => this.listCityList = data);
  }

  recargarLista() {
    this.cargarData(true)
  }

  openModal(item?: CityList) {
    const dialogRef = this.dialog.open(GenericFormComponent, {
      disableClose: true,
      width: '400px',
      data: {
        title: item ? 'Editar' : 'Crear',
        item,
        fields: [
          { name: 'id', value: item?.id || 0, hidden: true },
          { name: 'deparmentName', value: item?.deparmentName || '', hidden: true, type: 'string' },

          { name: 'name', label: 'Nombre', type: 'string', value: item?.name || '', required: true },
          {
            name: 'deparmentId',
            type: 'select',
            label: 'Departamento',
            value: 0 || '',
            options: this.listDeparment.map(m => ({
              label: m.name,
              value: m.id
            })),
            required: true
          }
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

      // 🔙 Vuelve a la ruta base sin /create
      this.router.navigate(['./'], { relativeTo: this.route });
    });
  }


  add(CityList: CityList, id?: number) {
    if (id) {
      this.apiService.update('City', CityList).subscribe(() => {
        this.recargarLista();
        this.snackbarService.showSuccess();
      })
    }
    else {
      this.apiService.Crear('City', CityList).subscribe(() => {
        this.recargarLista();
        this.snackbarService.showSuccess();
      })
    }
  }

  save(data?: CityList) {
    this.openModal(data)
  }

  delete(item: any) {
    this.apiService.delete("CityList", item.id).subscribe(() => {
      this.snackbarService.showSuccess('Ciudad eliminada con éxito')
      this.recargarLista();
    })
  }

  toggleIsActive(item: any) {
    this.apiService.deleteLogic('CityList', item.id).subscribe(() => {
      this.snackbarService.showSuccess("Ciudad actualizada con éxito");
    })
  }

}
