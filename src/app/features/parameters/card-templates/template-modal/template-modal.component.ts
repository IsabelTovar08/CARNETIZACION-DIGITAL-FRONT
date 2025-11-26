import { Component, Inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from "@angular/material/divider";
import { MatCardModule } from "@angular/material/card";
import {MatGridListModule} from '@angular/material/grid-list';

@Component({
  selector: 'app-template-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatDividerModule,
    MatCardModule,
    MatGridListModule
],
  templateUrl: './template-modal.component.html',
  styleUrl: './template-modal.component.css'
})
export class TemplateModalComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<TemplateModalComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  // estado
  isEditMode = false;
  previewFront = signal<string | null>(null);
  previewBack = signal<string | null>(null);

  form!: FormGroup; // <-- Declarada, pero NO inicializada todavía

  ngOnInit(): void {

    // ✔️ Inicialización CORRECTA
    this.form = this.fb.group({
      name: ['', Validators.required],
      frontSvg: [null],
      backSvg: [null]
    });

    // Si viene para editar
    if (this.data?.template) {
      this.isEditMode = true;
      this.loadTemplate(this.data.template);
    }
  }

  loadTemplate(t: any) {
    this.form.patchValue({ name: t.name });

    this.previewFront.set(t.frontBackgroundUrl);
    this.previewBack.set(t.backBackgroundUrl);
  }

  preview(file: File, target: 'front' | 'back') {
    const reader = new FileReader();
    reader.onload = () => {
      if (target === 'front') this.previewFront.set(reader.result as string);
      else this.previewBack.set(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  uploadFront(e: any) {
    const file = e.target.files[0];
    if (!file) return;

    this.form.patchValue({ frontSvg: file });
    this.preview(file, 'front');
  }

  uploadBack(e: any) {
    const file = e.target.files[0];
    if (!file) return;

    this.form.patchValue({ backSvg: file });
    this.preview(file, 'back');
  }

  submit() {
    if (!this.form.valid) return;

    const payload = {
      name: this.form.value.name!,
      frontSvg: this.form.value.frontSvg,
      backSvg: this.form.value.backSvg
    };

    if (this.isEditMode) {
      this.dialogRef.close({
        mode: 'edit',
        id: this.data.template.id,
        data: payload
      });
    } else {
      this.dialogRef.close({
        mode: 'create',
        data: payload
      });
    }
  }

  close() {
    this.dialogRef.close();
  }
}
