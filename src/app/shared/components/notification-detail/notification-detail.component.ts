import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from "@angular/material/icon";
import { Notification } from '../generic-notification/generic-notification.component';
import { CommonModule } from '@angular/common';
import { MatButton, MatButtonModule } from "@angular/material/button";

@Component({
  selector: 'app-notification-detail',
  imports: [MatIconModule, CommonModule, MatButton, MatButtonModule, MatDialogModule],
  templateUrl: './notification-detail.component.html',
  styleUrl: './notification-detail.component.css'
})
export class NotificationDetailComponent {
  constructor(
    public dialogRef: MatDialogRef<NotificationDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public notification: any
  ) { }

  close(): void {
    this.dialogRef.close();
  }
}
