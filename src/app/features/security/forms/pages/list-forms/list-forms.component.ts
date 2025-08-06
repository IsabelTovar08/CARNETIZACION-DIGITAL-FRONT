import { Component } from '@angular/core';
import { GenericTableComponent } from "../../../../../shared/components/generic-table/generic-table.component";
import { ApiService } from '../../../../../core/Services/api/api.service';

@Component({
  selector: 'app-list-forms',
  imports: [GenericTableComponent],
  templateUrl: './list-forms.component.html',
  styleUrl: './list-forms.component.css'
})
export class ListFormsComponent {
constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.ObtenerTodo('Form').subscribe(forms => {
      this.items = forms;
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
