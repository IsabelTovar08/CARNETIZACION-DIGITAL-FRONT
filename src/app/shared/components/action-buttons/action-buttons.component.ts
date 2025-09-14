import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-action-buttons',
  imports: [],
  templateUrl: './action-buttons.component.html',
  styleUrl: './action-buttons.component.css'
})
export class ActionButtonsComponent {
  @Input() cancelLabel: string = 'Cancelar';
  @Input() saveLabel: string = 'Guardar';
  @Input() disableSave: boolean = false;

  @Output() cancel = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();
  /**
   *
   */

  constructor(private dialogRef: MatDialogRef<any>) {

  }

  onCancelClick() {
    this.cancel.emit();
  }

  onSaveClick() {
    this.save.emit();
  }

}
