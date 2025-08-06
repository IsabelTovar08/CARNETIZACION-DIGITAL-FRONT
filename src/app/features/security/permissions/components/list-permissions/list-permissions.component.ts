import { Component, OnInit, signal } from '@angular/core';
import { GenericTableComponent } from "../../../../../shared/components/generic-table/generic-table.component";
import { ApiService } from '../../../../../core/Services/api/api.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { GenericFormComponent } from '../../../../../shared/components/generic-form/generic-form.component';
import { Permission } from '../../../../../core/Models/security/permission.models';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-permissions',
  imports: [
    CommonModule,
    GenericTableComponent],
  templateUrl: './list-permissions.component.html',
  styleUrl: './list-permissions.component.css'
})
export class ListPermissionsComponent implements OnInit {
  listPermission$!: Observable<Permission[]>;

  constructor(private apiService: ApiService<Permission, Permission>,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.listPermission$ = this.apiService.ObtenerTodo('Permission')
    this.route.url.subscribe(segments => {
      const isCreate = segments.some(s => s.path === 'create');
      if (isCreate) {
        this.openModal();
      }
    });
  }

  openModal(item: any = null) {
    const dialogRef = this.dialog.open(GenericFormComponent, {
      width: '400px',
      data: {
        title: item ? 'Editar' : 'Crear',
        item
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // if (item) {
        //   this.save(result, item.id);
        // } else {
        //   this.save(result);
        // }
      }

      // 🔙 Vuelve a la ruta base sin /create
      this.router.navigate(['./'], { relativeTo: this.route });
    });
  }
  items: any[] = [
    { id: 1, name: 'John Doe', age: 25 },
  ];

  displayedColumns: string[] = ['name', 'description', 'isDeleted', 'actions'];


  save(data: any, id: number | null = null,) {
    this.openModal()
  }
  delete(item: any) { }
  toggleIsActive(item: any) { }
}
