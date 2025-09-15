import { Component } from '@angular/core';
import { ProfileCreate, ProfileList } from '../../../../../../core/Models/organization/profile.models';
import { ApiService } from '../../../../../../core/Services/api/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from '../../../../../../core/Services/snackbar/snackbar.service';
import { ListService } from '../../../../../../core/Services/shared/list.service';
import { GenericFormComponent } from '../../../../../../shared/components/generic-form/generic-form.component';
import { CommonModule } from '@angular/common';
import { GenericTableComponent } from '../../../../../../shared/components/generic-table/generic-table.component';

@Component({
  selector: 'app-perfiles',
  imports: [GenericTableComponent, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class PerfilesComponent {
  listProfile!: ProfileList[];
  displayedColumns: string[] = ['name', 'isDeleted', 'actions'];

  constructor(private apiService: ApiService<ProfileCreate, ProfileList>,
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
    this.apiService.ObtenerTodo('Profile').subscribe(data => 
      this.listProfile = data.data
    );
  }

  recargarLista() {
    this.cargarData(true)
  }

  openModal(item?: ProfileList) {
    const dialogRef = this.dialog.open(GenericFormComponent, {
      disableClose: true,
      width: '400px',
      data: {
        title: item ? 'Editar' : 'Crear',
        item,
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


  add(Profile: ProfileCreate, id?: number) {
    if (id) {
      this.apiService.update('Profile', Profile).subscribe(() => {
        this.recargarLista();
        this.snackbarService.showSuccess();
      })
    }
    else {
      this.apiService.Crear('Profile', Profile).subscribe(() => {
        this.recargarLista();
        this.snackbarService.showSuccess();
      })
    }
  }

  save(data?: ProfileList) {
    this.openModal(data)
  }

  delete(item: any) {
    this.apiService.delete("Profile", item.id).subscribe(() => {
      this.snackbarService.showSuccess('Perfil eliminado con éxito')
      this.recargarLista();
    })
  }

  toggleIsActive(item: any) {
    this.apiService.deleteLogic('Profile', item.id).subscribe(() => {
      this.snackbarService.showSuccess("Perfil actualizado con éxito");
      this.recargarLista();
    })
  }
}
