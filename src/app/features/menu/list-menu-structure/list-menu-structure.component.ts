import { Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatCardModule } from "@angular/material/card";
import { MatInputModule } from "@angular/material/input";
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MenuItem, MenuStructure } from '../../../core/Models/MenuItemModel';
import { FormMenuStructureComponent } from '../form-menu-structure/form-menu-structure.component';
import { MenuService } from '../../../core/Services/api/menu/menu.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { GenericTableComponent } from "../../../shared/components/generic-table/generic-table.component";
import { MatIconModule } from "@angular/material/icon";
import { MatChipsModule } from "@angular/material/chips";
import { RouterLink } from '@angular/router';
import { MatMenuModule } from "@angular/material/menu";
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-list-menu-structure',
  imports: [
    RouterLink,
    CommonModule,
    MatButtonModule,
    MatSelectModule, GenericTableComponent, MatIconModule, MatChipsModule, MatMenuModule],
  templateUrl: './list-menu-structure.component.html',
  styleUrl: './list-menu-structure.component.css'
})
export class ListMenuStructureComponent implements OnInit {
  // 1) DATA

  raw: MenuItem[] = [];
  /**
   *
   */
  constructor(
    private menuService: MenuService,
    private dialog: MatDialog
  ) {

  }
  ngOnInit(): void {
    this.menuService.ObtenerTodo('MenuStructure').subscribe((data) => {
      this.raw = data.data as MenuItem[];
    })
  }


  // 2) COLUMNAS
  columns = [
    { key: 'title', label: 'Título' },
    { key: 'type', label: 'Tipo' }
  ];
  displayedColumns = this.columns.map(c => c.key).concat('actions');

  // 4) Handlers que tu tabla genérica emite
  onCreate() {
    this.openFormDialog();
  }
  onEdit(item: any) {
    this.openFormDialog(item);
  }
  onDelete(item: any) {
    // Llama a tu servicio y refresca la tabla
  }
  onToggle(item: any) {
    // Si tu genérico usa isDeleted, aquí lo manejas (no aplica al menú, normalmente)
  }

  // 5) Dialog del formulario genérico
  openFormDialog(editing?: any) {
    console.log("kj")
    // Construyes los fields (ver sección 3) y abres tu componente de formulario genérico.
    // this.dialog.open(GenericFormDialogComponent, { data: { title, fields, values } })
    // .afterClosed().subscribe(val => guardar y refrescar).
    const ref = this.dialog.open(FormMenuStructureComponent, {
      maxWidth: '100vw',
      width: '60vw',
      // height: '90vh',
      panelClass: 'menu-editor-dialog', // para estilos finos
      data: editing // ← aquí pasas TODO el item
    });

    ref.afterClosed().subscribe((updated: MenuItem | undefined) => {
      if (updated) {
        // ✅ Aquí ya tienes el item actualizado (padre + children)
        //    Guarda en tu backend o actualiza el estado local
        console.log('Item actualizado:', updated);
      }
    });
  }
}
