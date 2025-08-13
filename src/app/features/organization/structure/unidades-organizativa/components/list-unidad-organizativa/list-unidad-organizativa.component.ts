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
  standalone: true,
  imports: [CommonModule, GenericTableComponent],
  templateUrl: './list-unidad-organizativa.component.html',
  styleUrls: ['./list-unidad-organizativa.component.css']
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
    this.cargarData();
    this.route.url.subscribe(segments => {
      const isCreate = segments.some(s => s.path === 'create');
      if (isCreate) this.openModal();
    });
  }

  cargarData() {
    this.apiService.ObtenerTodo('OrganizationalUnit').subscribe((data) => {
      this.listOrganization = data;
    })
  }

  openModal(item?: OrganizationalUnit) {
    const dialogRef = this.dialog.open(GenericFormComponent, {
      disableClose: true,
      width: '400px',
      data: { title: item ? 'Editar' : 'Crear', item }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.addOrUpdate(result, item?.id);
      this.router.navigate(['./'], { relativeTo: this.route });
    });
  }

  private addOrUpdate(payload: OrganizationalUnit, id?: number) {
    if (id) {
      this.apiService.update('OrganizationalUnit', { ...payload, id })
        .subscribe(() => { this.cargarData(); this.snackbarService.showSuccess(); });
    } else {
      this.apiService.Crear('OrganizationalUnit', payload)
        .subscribe(() => { this.cargarData(); this.snackbarService.showSuccess(); });
    }
  }

  save(data?: OrganizationalUnit) { this.openModal(data); }

  delete(item: OrganizationalUnit) {
    this.apiService.delete('OrganizationalUnit', item.id).subscribe(() => {
      this.snackbarService.showInfo('Unidad organizativa eliminada con éxito');
      this.cargarData();
    });
  }

  toggleIsActive(item: OrganizationalUnit) {
    // implementar si tienes endpoint de toggle
  }
}
