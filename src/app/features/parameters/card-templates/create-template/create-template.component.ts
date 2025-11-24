import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

interface TemplateStyle {
  name: string;
  backgroundImage: File;
}

@Component({
  selector: 'app-create-template',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './create-template.component.html',
  styleUrl: './create-template.component.css'
})
export class CreateTemplateComponent implements OnInit {
  templateForm!: FormGroup;


  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateTemplateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.templateForm = this.fb.group({
      name: ['', Validators.required],
      backgroundImage: [null, Validators.required]
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.templateForm.patchValue({
        backgroundImage: file
      });
    }
  }

  onSubmit(): void {
    if (this.templateForm.valid) {
      const template: TemplateStyle = {
        ...this.templateForm.value,
        backgroundImage: this.selectedFile || undefined
      };
      console.log('Plantilla creada:', template);
      // Aquí iría la lógica para guardar la plantilla
      this.dialogRef.close(template);
    }
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }
}
