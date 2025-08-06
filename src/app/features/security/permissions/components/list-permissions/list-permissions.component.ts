import { Component } from '@angular/core';
import { GenericTableComponent } from "../../../../../shared/components/generic-table/generic-table.component";
import { ApiService } from '../../../../../core/Services/api/api.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { GenericFormComponent } from '../../../../../shared/components/generic-form/generic-form.component';

@Component({
  selector: 'app-list-permissions',
  imports: [GenericTableComponent],
  templateUrl: './list-permissions.component.html',
  styleUrl: './list-permissions.component.css'
})
export class ListPermissionsComponent {
  constructor(private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.apiService.ObtenerTodo('Permission').subscribe(permission => {
      this.items = permission;
    })
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


  save(data: any, id: number | null = null, ) {
    this.openModal()
   }
  delete(item: any) { }
  toggleIsActive(item: any) { }
}
