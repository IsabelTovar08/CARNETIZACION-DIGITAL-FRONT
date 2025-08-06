import { Component, OnInit, signal } from '@angular/core';
import { GenericTableComponent } from "../../../../../shared/components/generic-table/generic-table.component";
import { ApiService } from '../../../../../core/Services/api/api.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { GenericFormComponent } from '../../../../../shared/components/generic-form/generic-form.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarService } from '../../../../../core/Services/snackbar/snackbar.service';
import { FromModel } from '../../../../../core/Models/security/form.models';

@Component({
  selector: 'app-list-forms',
  imports: [
    CommonModule,
    GenericTableComponent],
  templateUrl: './list-forms.component.html',
  styleUrl: './list-forms.component.css'
})
export class ListFormsComponent implements OnInit {
  listForms$!: Observable<FromModel[]>;

  constructor(private apiService: ApiService<FromModel, FromModel>,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private snackbarService: SnackbarService
  ) { }

  ngOnInit(): void {
    this.cargarData();
  }

  displayedColumns: string[] = ['name', 'description', 'url', 'isDeleted', 'actions'];

  cargarData() {
    this.listForms$ = this.apiService.ObtenerTodo('Form')
  }

  openModal(item?: FromModel) {
    const dialogRef = this.dialog.open(GenericFormComponent, {
      disableClose: true,
      width: '400px',
      data: {
        title: item ? 'Editar' : 'Crear',
        item,
        fields: [
          { name: 'url', label: 'Ruta', type: 'string', value: item?.url || '', required: true }
        ],
        replaceBaseFields: false
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


  add(Form: FromModel, id?: number) {
    if (id) {
      this.apiService.update('Form', Form).subscribe(() => {
        this.cargarData();
        this.snackbarService.showSuccess();
      })
    }
    else {
      this.apiService.Crear('Form', Form).subscribe(() => {
        this.cargarData();
        this.snackbarService.showSuccess();
      })
    }
  }

  save(data?: FromModel) {
    this.openModal(data)
  }

  delete(item: any) {
    this.apiService.delete("Form", item.id).subscribe(() => {
      this.snackbarService.showInfo('Formulario eliminado con éxito')
      this.cargarData();
    })
  }
  toggleIsActive(item: any) { }
}
