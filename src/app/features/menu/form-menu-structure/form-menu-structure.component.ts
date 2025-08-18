// form-menu-structure.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormArray, FormControl, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatDividerModule } from "@angular/material/divider";
import { MatButtonModule } from "@angular/material/button";
import { MatExpansionModule } from '@angular/material/expansion';

import { MenuItem } from '../../../core/Models/MenuItemModel';
import { DataService } from '../../../core/Services/shared/data.service';

// 👉 Interfaces para poblar selects (adáptalas a tus modelos reales)
interface IModuleOpt { id: number; name: string; }
interface IFormOpt { id: number; name: string; }

// 👉 DTO esperado por el backend
interface IMenuStructureDto {
  id: number;
  parentMenuId?: number | null;
  moduleId?: number | null;
  formId?: number | null;
  type: string;
  orderIndex: number;
  // Cuando NO hay module ni form, puedes incluir icon/url propios si tu API lo soporta en otro contrato.
  // Children:
  children: IMenuStructureDto[];
}

@Component({
  selector: 'app-form-menu-structure',
  standalone: true,
  imports: [
    MatInputModule, MatSelectModule, MatDialogModule, ReactiveFormsModule, MatFormFieldModule,
    CommonModule, MatCardModule, MatIconModule, MatDividerModule, MatButtonModule, MatExpansionModule
  ],
  templateUrl: './form-menu-structure.component.html',
  styleUrls: ['./form-menu-structure.component.css']
})
export class FormMenuStructureComponent implements OnInit {

  // ✅ Opciones (cárgalas desde tus servicios reales)
  modules: IModuleOpt[] = []; // ← TODO: inyectar servicio y llenar
  forms: IFormOpt[] = [];     // ← TODO: inyectar servicio y llenar

  // ✅ Form principal (padre)
  form: FormGroup;

  // ✅ Acceso rápido al FormArray de hijos (nivel 1)
  get children(): FormArray {
    return this.form.get('children') as FormArray;
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: MenuItem,     // ← recibe TODO el item
    private dialogRef: MatDialogRef<FormMenuStructureComponent>,
    private fb: FormBuilder,
        private dataService: DataService,

  ) {
    this.form = this.fb.group({
      id: new FormControl(data.id ?? 0, { nonNullable: true }),
      parentMenuId: new FormControl<number | null>(null), // ← si abres sobre un padre específico, setéalo
      title: new FormControl<string>(data.title ?? '', { nonNullable: true, validators: [Validators.required, Validators.maxLength(100)] }),
      type: new FormControl<'group' | 'collapse' | 'item'>((data.type as any) ?? 'item', { nonNullable: true }),
      orderIndex: new FormControl<number>(0, { nonNullable: true, validators: [Validators.min(0)] }),

      // ⚠️ Relación a módulo / formulario (mutuamente excluyentes)
      moduleId: new FormControl<number | null>(null),
      formId: new FormControl<number | null>(null),

      // 💡 Solo se usan si NO hay moduleId ni formId
      icon: new FormControl<string | null>(data.icon ?? null),
      url: new FormControl<string | null>(data['url'] ?? null),

      children: this.fb.array(
        (data.children ?? []).map(c => this.makeChildGroup(c))
      )
    }, { validators: [this.xorValidator('moduleId', 'formId')] });

    // 🔒 Habilitar/Deshabilitar url/icon según relación
    this.setupUrlIconToggles(this.form);
  }
  ngOnInit(): void {
    this.dataService.modules$.subscribe(data => this.modules = data);
    this.dataService.getModules();
  }

  // 🧱 Grupo para hijo (nivel 1)
  private makeChildGroup(child?: Partial<MenuItem>): FormGroup {
    const group = this.fb.group({
      id: new FormControl(child?.id ?? 0, { nonNullable: true }),
      parentMenuId: new FormControl<number | null>(null),
      title: new FormControl<string>(child?.title ?? '', { nonNullable: true, validators: [Validators.required, Validators.maxLength(100)] }),
      type: new FormControl<'group' | 'collapse' | 'item'>((child?.type as any) ?? 'item', { nonNullable: true }),
      orderIndex: new FormControl<number>(0, { nonNullable: true, validators: [Validators.min(0)] }),

      moduleId: new FormControl<number | null>(null),
      formId: new FormControl<number | null>(null),

      icon: new FormControl<string | null>(child?.icon ?? null),
      url: new FormControl<string | null>((child as any)?.url ?? null),

      // Nietos (nivel 2)
      children: this.fb.array(
        (child?.children ?? []).map(gc => this.makeGrandChildGroup(gc))
      )
    }, { validators: [this.xorValidator('moduleId', 'formId')] });

    this.setupUrlIconToggles(group);
    return group;
  }

  // 🧱 Grupo para nieto (nivel 2)
  private makeGrandChildGroup(gchild?: Partial<MenuItem>): FormGroup {
    const group = this.fb.group({
      id: new FormControl(gchild?.id ?? 0, { nonNullable: true }),
      parentMenuId: new FormControl<number | null>(null),
      title: new FormControl<string>(gchild?.title ?? '', { nonNullable: true, validators: [Validators.required, Validators.maxLength(100)] }),
      type: new FormControl<'group' | 'collapse' | 'item'>((gchild?.type as any) ?? 'item', { nonNullable: true }),
      orderIndex: new FormControl<number>(0, { nonNullable: true, validators: [Validators.min(0)] }),

      moduleId: new FormControl<number | null>(null),
      formId: new FormControl<number | null>(null),

      icon: new FormControl<string | null>(gchild?.icon ?? null),
      url: new FormControl<string | null>((gchild as any)?.url ?? null),

      children: this.fb.array([]) // ← puedes seguir anidando si lo necesitas
    }, { validators: [this.xorValidator('moduleId', 'formId')] });

    this.setupUrlIconToggles(group);
    return group;
  }

  // ➕ Agregar hijo (nivel 1)
  addChild(): void {
    this.children.push(this.makeChildGroup());
  }

  // 🧽 Remover hijo (nivel 1)
  removeChild(index: number): void {
    this.children.removeAt(index);
  }

  // ✅ Getter de nietos por índice del hijo
  grandChildren(i: number): FormArray {
    return (this.children.at(i) as FormGroup).get('children') as FormArray;
  }

  // ➕ Agregar nieto a un hijo específico
  addGrandChild(i: number): void {
    this.grandChildren(i).push(this.makeGrandChildGroup());
  }

  // 🧽 Remover nieto
  removeGrandChild(i: number, j: number): void {
    this.grandChildren(i).removeAt(j);
  }

  // 💾 Guardar y cerrar (mapeo exacto al DTO del backend)
  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // 👉 Si abriste el modal dentro de un padre, puedes setear parentMenuId antes de mapear
    const dto = this.mapToDto(this.form.value as any, /*parentId*/ null);
    this.dialogRef.close(dto);
  }

  cancel(): void {
    this.dialogRef.close();
  }

  trackByIndex(i: number): number { return i; }

  // ===================== Helpers =====================

  // Validador XOR: exactamente uno o ninguno (ajústalo a requerido si hace falta)
  //  - Si quieres "exactamente uno", cambia la condición a (hasModule ^ hasForm) === true
  //  - Ahora mismo permite: ninguno o solo uno; nunca ambos.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private noop = null;




  // ===== Validators & utilities (fuera de la clase para reuso) =====

// XOR validator entre dos controles (permite ninguno o uno; no ambos)
 xorValidator(aKey: string, bKey: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const a = group.get(aKey)?.value ?? null;
    const b = group.get(bKey)?.value ?? null;
    const hasA = a !== null && a !== undefined && a !== '';
    const hasB = b !== null && b !== undefined && b !== '';
    return (hasA && hasB) ? { xor: 'moduleId y formId no pueden estar ambos' } : null;
  };
}

// Habilitar/Deshabilitar url/icon según tenga moduleId o formId
 setupUrlIconState(fg: FormGroup) {
  const moduleId = fg.get('moduleId')!;
  const formId = fg.get('formId')!;
  const url = fg.get('url')!;
  const icon = fg.get('icon')!;

  const toggle = () => {
    const hasRel = !!moduleId.value || !!formId.value;
    if (hasRel) {
      url.disable({ emitEvent: false });
      icon.disable({ emitEvent: false });
    } else {
      url.enable({ emitEvent: false });
      icon.enable({ emitEvent: false });
    }
  };

  toggle(); // estado inicial
  moduleId.valueChanges.subscribe(toggle);
  formId.valueChanges.subscribe(toggle);
}

// Hook para llamar desde cada FormGroup creado
 setupUrlIconToggles(fg: FormGroup) {
  this.setupUrlIconState(fg);
}

// Mapear recursivamente al DTO del backend
 mapToDto(node: any, parentId: number | null): IMenuStructureDto {
  return {
    id: node.id ?? 0,
    parentMenuId: parentId,
    moduleId: node.moduleId ?? null,
    formId: node.formId ?? null,
    type: node.type,
    orderIndex: Number(node.orderIndex ?? 0),
    children: (node.children ?? []).map((c: any) => this.mapToDto(c, node.id || null))
  };
}
}


