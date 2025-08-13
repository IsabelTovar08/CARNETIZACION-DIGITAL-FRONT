import { CustomTypeService } from './../../../../../core/Services/api/custom-type.service';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatCardModule } from "@angular/material/card";
import { CustomTypeCreate, CustomTypeList, TypeCategory } from '../../../../../core/Models/parameter/custom-type.models';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../../../core/Services/api/api.service';
import { forkJoin } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from '../../../../../core/Services/snackbar/snackbar.service';
import { GenericFormComponent } from '../../../../../shared/components/generic-form/generic-form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MatMenuModule } from "@angular/material/menu";
import Swal from 'sweetalert2';
import { MatTooltipModule } from '@angular/material/tooltip';


@Component({
  selector: 'app-list-type-category',
  imports: [MatIconModule, MatListModule, MatCardModule, MatButtonModule, CommonModule, MatMenuModule, MatTooltipModule],
  templateUrl: './list-type-category.component.html',
  styleUrl: './list-type-category.component.css'
})
export class ListTypeCategoryComponent implements OnInit {
  listCategories!: TypeCategory[];
  listTypes: CustomTypeList[] = [];

  /**
   *
   */
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ctService: CustomTypeService,
    private typeCService: ApiService<TypeCategory, TypeCategory>,
    private apiService: ApiService<any, any>,
    private dialog: MatDialog,
    private snackbarService: SnackbarService

  ) {

  }
  loadAll() {
    forkJoin([
      this.typeCService.ObtenerTodo('TypeCategory'),
      this.ctService.ObtenerTodo('CustomType')
    ]).subscribe(([categories, types]) => {
      this.listCategories = categories;
      this.listTypes = types;

      // Asignar los tipos dentro de cada categoría
      this.listCategories.forEach(cat => {
        cat.types = this.listTypes.filter(t => t.typeCategoryId === cat.id);
      });
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }


  // CRUD Categorías
  openCategoryModal(item?: TypeCategory) {
    const dialogRef = this.dialog.open(GenericFormComponent, {
      disableClose: true,
      width: '400px',
      data: {
        title: item ? 'Editar' : 'Crear',
        item,
        fields: [
          { name: 'id', value: item?.id || 0, hidden: true },
          { name: 'name', label: 'Nombre', type: 'string', value: item?.name || '', required: true },
        ],
        replaceBaseFields: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (item) {
          this.add(result, item.id);
        } else {
          this.add(result);
        }
      }

    });
  }
  add(TypeCategory: TypeCategory, id?: number) {
    if (id) {
      this.typeCService.update('TypeCategory', TypeCategory).subscribe(() => {
        this.loadAll();
        this.snackbarService.showSuccess();
      })
    }
    else {
      this.typeCService.Crear('TypeCategory', TypeCategory).subscribe(() => {
        this.loadAll();
        this.snackbarService.showSuccess();
      })
    }
  }
  deleteCategory(id: number) {
    this.deleteEntity(id, 'TypeCategory');
  }
  toggleCategory(category: TypeCategory) {
    this.toggleEntityActive(category.id, category.isDeleted, 'TypeCategory')
  }

  // CRUD Tipos
  openTypeModal(item: CustomTypeList | null, category: TypeCategory) {
    const dialogRef = this.dialog.open(GenericFormComponent, {
      disableClose: true,
      width: '400px',
      data: {
        title: item ? 'Editar' : 'Crear',
        item,
        fields: [
          { name: 'typeCategoryId', value: item?.typeCategoryId || category.id, hidden: true },
        ],
        replaceBaseFields: false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (item) {
          this.addCustomType(result, item.id);
        } else {
          this.addCustomType(result);
        }
      }

    });
  }
  addCustomType(CustomType: CustomTypeCreate, id?: number) {
    if (id) {
      this.typeCService.update('CustomType', CustomType).subscribe(() => {
        this.loadAll();
        this.snackbarService.showSuccess();
      })
    }
    else {
      this.typeCService.Crear('CustomType', CustomType).subscribe(() => {
        this.loadAll();
        this.snackbarService.showSuccess();
      })
    }
  }

  deleteEntity(entityId: number, entityName: string) {
    Swal.fire({
      icon: 'warning',
      title: `¿Eliminar?`,
      text: `¿Estás seguro que deseas eliminar este regitro? Esta acción no se puede revertir.`,
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then(result => {
      if (result.isConfirmed) {
        this.performDelete(entityId, entityName);
      }
    });
  }

  toggleEntityActive(entityId: number, isActive: boolean, entityName: string) {
    const action = isActive ? 'activar' : 'desactivar';
    Swal.fire({
      icon: 'question',
      title: `¿${action.charAt(0).toUpperCase() + action.slice(1)} registro?`,
      text: `¿Quieres ${action} este registro?`,
      showCancelButton: true,
      confirmButtonText: `Sí, ${action}`,
      cancelButtonText: 'Cancelar',
    }).then(result => {
      if (result.isConfirmed) {
        this.performToggleActive(entityId, entityName);
      }
    });
  }

  // Métodos privados (a implementar)
  private performDelete(entityId: number, entityName: string) {
    this.apiService.delete(entityName, entityId).subscribe(() => {
      this.loadAll()
      this.snackbarService.showSuccess("Registro eliminado correctamente")
    })
  }

  private performToggleActive(entityId: number, entityName: string) {
    this.apiService.deleteLogic(entityName, entityId).subscribe(() => {
      this.loadAll()
      this.snackbarService.showSuccess("Registro actualizado correctamente")
    })
  }


  deleteCustomType(id: number) {
    this.deleteEntity(id, 'CustomType');

  }
  toggleType(type: CustomTypeList) {
    this.toggleEntityActive(type.id, type.isDeleted, 'CustomType')

  }



  maxVisibleTypes = 3; // máximo tipos a mostrar sin expandir

  // Lleva el estado de cada categoría si está expandida o no
  expandedCategories = new Set<number>(); // asumiendo que category tiene un id numérico, ej category.id

  // Retorna los tipos visibles para la categoría
  getVisibleTypes(category: any) {
    if (this.expandedCategories.has(category.id)) {
      return category.types;
    }
    return category.types.slice(0, this.maxVisibleTypes);
  }

  // Cambia estado de mostrar todos o no
  toggleShowAllTypes(category: any) {
    if (this.expandedCategories.has(category.id)) {
      this.expandedCategories.delete(category.id);
    } else {
      this.expandedCategories.add(category.id);
    }
  }

  // Indica si se están mostrando todos los tipos
  isShowingAllTypes(category: any) {
    return this.expandedCategories.has(category.id);
  }

}
