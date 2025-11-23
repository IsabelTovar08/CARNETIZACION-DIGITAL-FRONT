import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

interface TemplateStyle {
  name: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  fontSize: number;
  layout: string;
  backgroundImage?: File;
}

@Component({
  selector: 'app-create-template',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './create-template.component.html',
  styleUrl: './create-template.component.css'
})
export class CreateTemplateComponent implements OnInit {
  templateForm!: FormGroup;

  fontOptions = [
    { value: 'Arial', label: 'Arial' },
    { value: 'Helvetica', label: 'Helvetica' },
    { value: 'Times New Roman', label: 'Times New Roman' },
    { value: 'Courier New', label: 'Courier New' }
  ];

  layoutOptions = [
    { value: 'horizontal', label: 'Horizontal' },
    { value: 'vertical', label: 'Vertical' },
    { value: 'centered', label: 'Centrado' }
  ];

  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateTemplateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.templateForm = this.fb.group({
      name: ['', Validators.required],
      backgroundColor: ['#ffffff', Validators.required],
      textColor: ['#000000', Validators.required],
      fontFamily: ['Arial', Validators.required],
      fontSize: [12, [Validators.required, Validators.min(8), Validators.max(24)]],
      layout: ['horizontal', Validators.required],
      backgroundImage: [null]
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
