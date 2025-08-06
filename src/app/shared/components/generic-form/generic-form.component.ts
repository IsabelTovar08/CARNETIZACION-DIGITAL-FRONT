import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-generic-form',
  imports: [
    ReactiveFormsModule,
    MatInputModule
  ],
  templateUrl: './generic-form.component.html',
  styleUrl: './generic-form.component.css'
})
export class GenericFormComponent {
 form: FormGroup;
  title: string;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<GenericFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.title = data.title || 'Formulario';
    this.form = this.fb.group({
      name: [data.item?.name || '', Validators.required],
      description: [data.item?.description || '', Validators.required]
    });
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
