import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';

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
    MatInputModule
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

  emitEdit(item: any) {
    this.onEdit.emit(item);
  }

  emitDelete(item: any) {
    this.onDelete.emit(item);
  }

  emitToggle(item: any) {
    this.onToggleStatus.emit(item);
  }

  emitCreate() {
    this.onCreate.emit();
  }
}
