import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AttendanceItem } from '../../../core/Models/operational/attendance.model';

@Component({
  selector: 'app-attendance-modal',
  standalone: true,
  imports: [MatDialogModule, MatTableModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, CommonModule, FormsModule],
  templateUrl: `./attendance-modal.component.html`,
  styleUrl: `./attendance-modal.component.css`
})
export class AttendanceModalComponent {
  displayedColumns: string[] = ['personFullName', 'timeOfEntryStr', 'timeOfExitStr', 'accessPointOfEntryName', 'accessPointOfExitName'];
  searchTerm: string = '';

  constructor(
    public dialogRef: MatDialogRef<AttendanceModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { eventName: string; attendances: AttendanceItem[] }
  ) {}

  get filteredAttendances(): AttendanceItem[] {
    if (!this.searchTerm) {
      return this.data.attendances;
    }
    const term = this.searchTerm.toLowerCase();
    return this.data.attendances.filter(attendance =>
      attendance.personFullName.toLowerCase().includes(term)
    );
  }
}