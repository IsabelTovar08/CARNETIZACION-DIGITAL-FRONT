import { Component } from '@angular/core';
import { GenericTableComponent } from "../../../../../../shared/components/generic-table/generic-table.component";
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Deparment } from '../../../../../../core/Models/parameter/ubication.models';
import { ApiService } from '../../../../../../core/Services/api/api.service';
import { SnackbarService } from '../../../../../../core/Services/snackbar/snackbar.service';
import { GenericFormComponent } from '../../../../../../shared/components/generic-form/generic-form.component';
import { ListService } from '../../../../../../core/Services/shared/list.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-deparment',
  imports: [GenericTableComponent, CommonModule],
  templateUrl: './list-deparment.component.html',
  styleUrl: './list-deparment.component.css'
})
export class ListDeparmentComponent {
  listDeparment!: Deparment[];
  displayedColumns: string[] = ['name', 'isDeleted', 'actions'];

  constructor(private apiService: ApiService<Deparment, Deparment>,
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
    this.listService.getdeparments(reload).subscribe(data => this.listDeparment = data);
  }

  recargarLista(){
    this.cargarData(true)
  }

  openModal(item?: Deparment) {
    const dialogRef = this.dialog.open(GenericFormComponent, {
      disableClose: true,
      width: '400px',
      data: {
        title: item ? 'Editar' : 'Crear',
        item,
         fields: [
          { name: 'id', value: item?.id || 0, hidden: true },
          { name: 'name', label: 'Nombre', type: 'string', value: item?.name || '', required: true },
          //  {
          //     name: 'moduleId',
          //     type: 'select',
          //     label: 'Departamento',
          //     value: 0 || '',
          //     options: this.listDeparment.map(m => ({
          //       label: m.name,
          //       value: m.id
          //     })),
          //     required: true
          //   }
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


  add(Deparment: Deparment, id?: number) {
    if (id) {
      this.apiService.update('Deparment', Deparment).subscribe(() => {
        this.recargarLista();
        this.snackbarService.showSuccess();
      })
    }
    else {
      this.apiService.Crear('Deparment', Deparment).subscribe(() => {
        this.recargarLista();
        this.snackbarService.showSuccess();
      })
    }
  }

  save(data?: Deparment) {
    this.openModal(data)
  }

  delete(item: any) {
    this.apiService.delete("Deparment", item.id).subscribe(() => {
      this.snackbarService.showSuccess('Departamento eliminado con éxito')
      this.recargarLista();
    })
  }

  toggleIsActive(item: any) {
    this.apiService.deleteLogic('Deparment', item.id).subscribe(() => {
      this.snackbarService.showSuccess("Departamento actualizado con éxito");
    })
  }
}
