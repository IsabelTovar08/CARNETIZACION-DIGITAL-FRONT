
import { CommonModule } from '@angular/common';
import { Component, ContentChildren, EventEmitter, Input, Output, QueryList, TemplateRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MatSelectModule } from "@angular/material/select";
import { MatDividerModule } from "@angular/material/divider";
import { MatMenuModule } from "@angular/material/menu";
import { MatCheckboxModule } from "@angular/material/checkbox";
import {MatPaginatorModule} from '@angular/material/paginator';

@Component({
  selector: 'app-generic-table',
  imports: [
    CommonModule,
    MatSlideToggle,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatDividerModule,
    MatMenuModule,
    MatPaginatorModule
],
  templateUrl: './generic-table.component.html',
  styleUrl: './generic-table.component.css'
})
export class GenericTableComponent {
  @Input() title: string = '';
  @Input() dataSource: any[] = [];
  @Input() displayedColumns: string[] = [];
  @Input() columns: { key: string, label: string }[] = [];

  @Output() onEdit = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();
  @Output() onToggleStatus = new EventEmitter<any>();
  @Output() onCreate = new EventEmitter<void>();

  @Input() customTemplates: { [key: string]: TemplateRef<any> } = {};

  /**
   *
   */
  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {


  }

  emitEdit(item: any) {
    this.onEdit.emit(item);
  }


  emitDelete(item: any) {
    Swal.fire({
      icon: 'warning',
      title: '¿Eliminar registro?',
      text: 'Esta acción no se puede deshacer. ¿Estás seguro?',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.onDelete.emit(item);
      }
    });
  }

  emitToggle(item: any) {
    const isActivating = !item.status;

    Swal.fire({
      icon: 'question',
      title: `${isActivating ? '¿Activar' : '¿Desactivar'} registro?`,
      text: `Estás a punto de ${isActivating ? 'activar' : 'desactivar'} este elemento.`,
      showCancelButton: true,
      confirmButtonText: `Sí, ${isActivating ? 'activar' : 'desactivar'}`,
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.onToggleStatus.emit(item);
        Swal.fire(
          isActivating ? 'Activado' : 'Desactivado',
          `El elemento ha sido ${isActivating ? 'activado' : 'desactivado'} correctamente.`,
          'success'
        );
      }
    });
  }

  emitCreate() {
    this.router.navigate(['create'], { relativeTo: this.route });
    this.onCreate.emit();
  }
}
