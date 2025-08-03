import { Component, OnInit } from '@angular/core';
import { GenericTableComponent } from "../../../../../shared/components/generic-table/generic-table.component";
import { ApiService } from '../../../../../core/Services/api/api.service';
import { RouterModule } from "@angular/router";

@Component({
  selector: 'app-list-person',
  imports: [GenericTableComponent, RouterModule],
  templateUrl: './list-person.component.html',
  styleUrl: './list-person.component.css'
})
export class ListPersonComponent implements OnInit {
  constructor(private apiService: ApiService){}
  ngOnInit(): void {
    this.apiService.ObtenerTodo('Person').subscribe(person => {
      this.items = person;
    })
  }
  items: any[] = [
    { id: 1, name: 'John Doe', age: 25 },
  ];

  displayedColumns: string[] = ['firstName', 'documentNumber', 'documentTypeName', 'bloodTypeName', 'cityName', 'isDeleted', 'actions'];


  save() { }
  delete(item: any) {}
  toggleIsActive(item: any) {}
}
