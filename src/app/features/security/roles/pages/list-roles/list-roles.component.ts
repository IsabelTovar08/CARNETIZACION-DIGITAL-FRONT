import { Component } from '@angular/core';
import { GenericTableComponent } from "../../../../../shared/components/generic-table/generic-table.component";
import { ApiService } from '../../../../../core/Services/api/api.service';

@Component({
  selector: 'app-list-roles',
  imports: [GenericTableComponent],
  templateUrl: './list-roles.component.html',
  styleUrl: './list-roles.component.css'
})
export class ListRolesComponent {
constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.ObtenerTodo('Rol').subscribe(rol => {
      this.items = rol;
    })
  }
  items: any[] = [
    { id: 1, name: 'John Doe', age: 25 },
  ];

  displayedColumns: string[] = ['name', 'description', 'isDeleted', 'actions'];


  save() { }
  delete(item: any) { }
  toggleIsActive(item: any) { }
}
