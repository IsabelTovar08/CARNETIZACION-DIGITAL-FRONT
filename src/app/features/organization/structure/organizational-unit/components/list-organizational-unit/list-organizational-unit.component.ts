import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { GenericTableComponent } from '../../../../../../shared/components/generic-table/generic-table.component';
import { Observable } from 'rxjs';
import { ApiService } from '../../../../../../core/Services/api/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from '../../../../../../core/Services/snackbar/snackbar.service';
import { GenericFormComponent } from '../../../../../../shared/components/generic-form/generic-form.component';
import { OrganizationalUnit } from '../../../../../../core/Models/organization/organizationalUnit.models';

@Component({
  selector: 'app-list-unidad-organizativa',
  imports: [CommonModule, GenericTableComponent],
  templateUrl: './list-organizational-unit.component.html',
  styleUrls: ['./list-organizational-unit.component.css']
})
export class ListUnidadOrganizativaComponent {

  listOrganization!: OrganizationalUnit[];
  displayedColumns: string[] = ['name', 'divisionsCount', 'branchesCount', 'actions'];

  constructor(
    private apiService: ApiService<OrganizationalUnit, OrganizationalUnit>,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.cargarData(false);
    this.route.url.subscribe(segments => {
      const isCreate = segments.some(s => s.path === 'create');
      if (isCreate) {this.openModal();
     }
    });
  }

  cargarData(reload: boolean ) {
    this.apiService.ObtenerTodo('OrganizationalUnit').subscribe((data) => {
      this.listOrganization = data;
    })
  }

  recargarLista(){
    this.cargarData(true)
  }

  openModal(item?: OrganizationalUnit) {
    const dialogRef = this.dialog.open(GenericFormComponent, {
      disableClose: true,
      width: '400px',
      data: { 
        title: item ? 'Editar' : 'Crear', 
        item,
        fields: [
          {name: 'id', value: item?.id || 0, hidden: true},
          {name: 'name', label: 'Nombre', type: 'string', value: item?.name || '', required: true},
        ],
        replaceBaseFields: true
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result){
        if(item){
          this.add(result, item.id);
        }else{
          this.add(result);
        }
      }

      this.router.navigate(['./'], { relativeTo: this.route });
    });
  }

  add(OrganizationalUnit: OrganizationalUnit, id?: number) {
    if (id) {
      this.apiService.update('OrganizationalUnit', OrganizationalUnit).subscribe(() => { 
            this.recargarLista(); 
            this.snackbarService.showSuccess(); 
          })
    } 
    else {
      this.apiService.Crear('OrganizationalUnit', OrganizationalUnit).subscribe(() => { 
          this.recargarLista(); 
          this.snackbarService.showSuccess(); 
        })
    }
  }

  save(data?: OrganizationalUnit) {
     this.openModal(data)
  }

  delete(item: any) {
    this.apiService.delete('OrganizationalUnit', item.id).subscribe(() => {
      this.snackbarService.showInfo('Unidad organizativa eliminada con éxito');
      this.recargarLista();
    });
  }

  toggleIsActive(item: any) {
    this.apiService.deleteLogic('OrganizationalUnit', item.id).subscribe(() => {
      this.snackbarService.showSuccess('Unidad organizativa actualizada con éxito');
    })
  }
}
