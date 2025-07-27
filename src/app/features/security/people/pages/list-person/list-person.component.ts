import { Component } from '@angular/core';
import { GenericTableComponent } from "../../../../../shared/components/generic-table/generic-table.component";

@Component({
  selector: 'app-list-person',
  imports: [GenericTableComponent],
  templateUrl: './list-person.component.html',
  styleUrl: './list-person.component.css'
})
export class ListPersonComponent {
  items: any[] = [
    { id: 1, name: 'John Doe', age: 25 },
  ];

  displayedColumns: string[] = ['name', 'description', 'actions'];

  save() { }
  delete(item: any) {}
  toggleIsActive(item: any) {}
}
