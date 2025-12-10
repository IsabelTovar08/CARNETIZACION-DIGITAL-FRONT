import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from "@angular/material/card";
import { MatStepperModule } from "@angular/material/stepper";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: 'app-file-upload',
  imports: [MatCardModule, CommonModule, MatButtonModule, MatStepperModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.css'
})
export class FileUploadComponent {
  selectedFile: File | null = null;
  fileForm: FormGroup;
  isDragOver = false;

  @Output() fileSelected = new EventEmitter<File>();
  @Output() fileUploaded = new EventEmitter<File>();

  constructor(private fb: FormBuilder) {
    this.fileForm = this.fb.group({
      file: [null, Validators.required]
    });
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.setFile(files[0]);
    }
  }
  removeFile(): void {
    this.selectedFile = null;
  }

  importFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.xlsx';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) this.setFile(file);
    };
    input.click();
  }

  private setFile(file: File) {
    this.selectedFile = file;
    this.fileForm.patchValue({ file });
    this.fileSelected.emit(file);
  }

  uploadFile() {
    if (this.selectedFile) {
      console.log('Cargando archivo:', this.selectedFile.name);
      this.fileUploaded.emit(this.selectedFile);
    }
  }

  /// <summary>
  /// Descarga la plantilla de carga masiva.
  /// </summary>
  downloadTemplate(): void {
    const url = '/assets/templates/plantilla-carga-masiva.xlsm';
    const link = document.createElement('a');
    link.href = url;
    link.download = 'plantilla-carga-masiva.xlsm';
    link.click();
  }


}
