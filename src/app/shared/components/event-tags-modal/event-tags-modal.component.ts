import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-event-tags-modal',
  imports: [],
  templateUrl: './event-tags-modal.component.html',
  styleUrl: './event-tags-modal.component.css'
})
export class EventTagsModalComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { title: string, tags: Array<{ label: string, color: string }> },
    private dialogRef: MatDialogRef<EventTagsModalComponent>
  ) {}

  close() {
    this.dialogRef.close();
  }
}
