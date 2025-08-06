import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';

@Component({
  selector: 'app-generic-form',
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    CommonModule,
    MatSelectModule
  ],
  templateUrl: './generic-form.component.html',
  styleUrl: './generic-form.component.css'
})
export class GenericFormComponent implements OnInit {
  form!: FormGroup;
  title: string = '';
  fields: any[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<GenericFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.title = this.data.title || 'Formulario';

    //  Campos predefinidos
    const baseFields = [
      { name : 'id', value: this.data.item?.id || 0, hidden: true },
      { name: 'name', label: 'Nombre', type: 'text', value: this.data.item?.name || '', required: true },
      { name: 'description', label: 'Descripción', type: 'textarea', value: this.data.item?.description || '' }
    ];

    //  Campos adicionales
    const extraFields = this.data.fields || [];

    //  Decidir qué campos mostrar
    this.fields = this.data.replaceBaseFields ? extraFields : [...baseFields, ...extraFields];

    // Crear el FormGroup
    const group: any = {};
    this.fields.forEach(field => {
      group[field.name] = [
        field.value,
        field.required ? Validators.required : []
      ];
    });

    this.form = this.fb.group(group);
  }

  get extras(): FormArray {
    return this.form.get('extras') as FormArray;
  }

  addExtraField(): void {
    this.extras.push(this.fb.control('', Validators.required));
  }

  removeExtraField(index: number): void {
    this.extras.removeAt(index);
  }

  save() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  cancel() {
    this.dialogRef.close(null);
  }
}
