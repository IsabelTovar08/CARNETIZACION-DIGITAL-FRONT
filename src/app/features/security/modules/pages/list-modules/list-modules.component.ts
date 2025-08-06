import { Component } from '@angular/core';
import { GenericTableComponent } from "../../../../../shared/components/generic-table/generic-table.component";
import { ApiService } from '../../../../../core/Services/api/api.service';

@Component({
  selector: 'app-list-modules',
  imports: [GenericTableComponent],
  templateUrl: './list-modules.component.html',
  styleUrl: './list-modules.component.css'
})
export class ListModulesComponent {
constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.ObtenerTodo('Module').subscribe(modules => {
      this.items = modules;
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
