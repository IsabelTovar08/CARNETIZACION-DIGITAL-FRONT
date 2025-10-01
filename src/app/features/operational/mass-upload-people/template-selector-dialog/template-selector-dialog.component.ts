import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { TemplateRendererComponent } from "../../../organization/templates/template-renderer/template-renderer.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-template-selector-dialog',
  imports: [MatDialogModule, TemplateRendererComponent, CommonModule],
  templateUrl: './template-selector-dialog.component.html',
  styleUrl: './template-selector-dialog.component.css'
})
export class TemplateSelectorDialogComponent {
constructor(
    public dialogRef: MatDialogRef<TemplateSelectorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { templates: any[] }
  ) {}

  selectTemplate(template: any) {
    this.dialogRef.close(template);
  }
}
