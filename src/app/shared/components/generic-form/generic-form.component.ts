import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from "@angular/material/divider";
import { ActionButtonsComponent } from "../action-buttons/action-buttons.component";
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-generic-form',
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    CommonModule,
    MatSelectModule,
    MatDividerModule,
    ActionButtonsComponent,
    MatCheckboxModule
  ],
  templateUrl: './generic-form.component.html',
  styleUrl: './generic-form.component.css'
})
export class GenericFormComponent implements OnInit {
  form!: FormGroup;
  title: string = '';
  subTitle: string = '';

  fields: any[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<GenericFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    console.log(this.data)
    this.title = this.data.title || 'Formulario';
    this.subTitle = this.data.subTitle || '';


    //  Campos predefinidos
    const baseFields = [
      { name: 'id', value: this.data.item?.id || 0, hidden: true },
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
      let value = field.value;
      if (field.type === 'checkbox') {
        value = !!field.value; // fuerza true/false
      }

      group[field.name] = [
        value,
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
