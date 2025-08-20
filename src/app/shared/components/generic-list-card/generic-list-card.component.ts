import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-generic-list-card',
  imports: [MatPaginatorModule, MatIconModule, MatCardModule, MatChipsModule, CommonModule, MatTooltipModule, MatButtonModule],
  templateUrl: './generic-list-card.component.html',
  styleUrl: './generic-list-card.component.css'
})
export class GenericListCardComponent {
  @Input() title = '';
  @Input() buttonSave = true;

  // Entrada principal
  @Input() set dataSourceInput(data: any[]) { this.items = data || []; }
  items: any[] = [];

  @Input() customTemplates: { [key: string]: TemplateRef<any> } = {};

  // Emitters estándar
  @Output() onCreate = new EventEmitter<void>();
  @Output() onView = new EventEmitter<any>();
  @Output() onEdit = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();
  @Output() onToggleStatus = new EventEmitter<any>();

  // Paginación simple
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Input() pageSize = 9;

  // Métodos de acciones por defecto
  emitCreate() { this.onCreate.emit(); }
  emitView(item: any) { this.onView.emit(item); }
  emitEdit(item: any) { this.onEdit.emit(item); }
  emitDelete(item: any) { this.onDelete.emit(item); }
  emitToggle(item: any) {
    item.isDeleted = !item.isDeleted;
    this.onToggleStatus.emit(item);
    this.items = [...this.items]; // refrescar
  }

  // Helpers para estados
  isLocked(item: any) { return !!item.isLocked; }
  isInactive(item: any) { return !!item.isDeleted; }
}
