import { Component } from '@angular/core';
import { ApiService } from '../../../../../../core/Services/api/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from '../../../../../../core/Services/snackbar/snackbar.service';
import { ListService } from '../../../../../../core/Services/shared/list.service';
import { GenericTableComponent } from '../../../../../../shared/components/generic-table/generic-table.component';
import { CommonModule } from '@angular/common';
import { GenericFormComponent } from '../../../../../../shared/components/generic-form/generic-form.component';
import { InternalDivisionCreate, InternalDivisionList } from '../../../../../../core/Models/organization/internal-divison.models';
import { OrganizationalUnitService } from '../../../../../../core/Services/api/organization-unit.service';
import { SubTitle } from 'chart.js';
import { GenericModel } from '../../../../../../core/Models/security/generic.model';

@Component({
  selector: 'app-divisiones-internas',
  standalone: true,
  imports: [GenericTableComponent, CommonModule],
  templateUrl: './internal-divisions.component.html',
  styleUrl: './internal-divisions.component.css'
})
export class DivisionesInternasComponent {
  listInternalDivicion!: InternalDivisionList[];
  displayedColumns: string[] = ['name', 'organizationalUnitName', 'areaCategoryName', 'isDeleted', 'actions'];

  // si navegas desde la tarjeta de Unidad Organizativa
  private organizationalUnitId!: number;
  organizationalUnitName?: string; 
  listareas: GenericModel[] = [];


  constructor(
    private apiService: ApiService<InternalDivisionCreate, InternalDivisionList>,
    private unitService: OrganizationalUnitService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private listService: ListService,
    private areaService: ApiService<GenericModel, GenericModel>,

  ) { }

  ngOnInit(): void {
    // toma el id si viene por la ruta o query
    this.route.paramMap.subscribe(pm => {
      const id = pm.get('organizationalUnitId') || pm.get('unitId') || pm.get('id');
      if (id) this.organizationalUnitId = Number(id);
      this.cargarData(false);
    });

    this.route.queryParamMap.subscribe(qp => {
      const id = qp.get('organizationalUnitId') || qp.get('unitId') || qp.get('id');
      if (id) {
        this.organizationalUnitId = Number(id);
        this.cargarData(false);
      }
    });

    // si la ruta termina con /create abre el modal
    this.route.url.subscribe(segments => {
      const isCreate = segments.some(s => s.path === 'create');
      if (isCreate) {
        this.openModal();
      }
    });

    this.CargarAreas();
  }

  /** Resuelve el endpoint igual que tu backend: GET /OrganizationalUnit/{id}/internal-divisions */
  private endpoint(): string {
    return this.organizationalUnitId
      ? `OrganizationalUnit/${this.organizationalUnitId}/internal-division`
      : 'InternalDivision'; // fallback si entras directo
  }

  cargarData(_reload: boolean) {
    this.unitService.GetInternalDivissionsByIdUnit(this.organizationalUnitId).subscribe(data => {
      // tu ApiService en algunos casos trae { data }, en otros un array directo
      const resp = (Array.isArray(data) ? data : data?.data) as InternalDivisionList[] | undefined;
      this.listInternalDivicion = resp ?? [];

      if (this.listInternalDivicion.length > 0) {
        const firstOrgUnitName = this.listInternalDivicion[0].organizationalUnitName;
        this.organizationalUnitName = firstOrgUnitName;
      }
    });
  }

  recargarLista() {
    this.cargarData(true);
    this.CargarAreas();
  }

  CargarAreas() {
    this.areaService.ObtenerTodo('AreaCategory').subscribe((data) => {
      this.listareas = data?.data ?? [];
      console.log(this.listareas);
    });
  }

  openModal(item?: InternalDivisionList) {
    const dialogRef = this.dialog.open(GenericFormComponent, {
      disableClose: true,
      width: '400px',
      data: {
        title: item ? 'Editar' : 'Crear',
        subTitle: this.organizationalUnitName,
        item,
        fields: [
          { name: 'AreaCategoryId', type: 'select', label: 'Área', 
            value: item?.areaCategoryId || '', 
            options: (this.listareas ?? []).map(a => ({ label: a.name, value: a.id })),
            required: true },
          { name: 'OrganizationalUnitId', value: item?.organizationalUnitId || this.organizationalUnitId, hidden: true }
        ],
        replaceBaseFields: false
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

  add(internalDivision: InternalDivisionCreate, id?: number) {
    if (id) {
      this.apiService.update('InternalDivision', internalDivision).subscribe(() => {
        this.recargarLista();
        this.snackbarService.showSuccess();
      });
    } else {
      this.apiService.Crear('InternalDivision', internalDivision).subscribe(() => {
        this.recargarLista();
        this.snackbarService.showSuccess();
      });
    }
  }

  save(data?: InternalDivisionList) {
    this.openModal(data);
  }

  delete(item: InternalDivisionList) {
    this.apiService.delete('InternalDivision', item.id).subscribe(() => {
      this.snackbarService.showSuccess('División interna eliminada con éxito');
      this.recargarLista();
    });
  }

  toggleIsActive(item: InternalDivisionList) {
    this.apiService.deleteLogic('InternalDivision', item.id).subscribe(() => {
      this.snackbarService.showSuccess('División interna actualizada con éxito');
      this.recargarLista();
    });
  }
}
