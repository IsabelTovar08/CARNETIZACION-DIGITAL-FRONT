import { Component, OnInit, signal } from '@angular/core';
import { GenericTableComponent } from "../../../../../shared/components/generic-table/generic-table.component";
import { ApiService } from '../../../../../core/Services/api/api.service';
import { RouterModule } from "@angular/router";
import { PersonCreate, PersonList } from '../../../../../core/Models/security/person.models';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-person',
  imports: [
    CommonModule,
    GenericTableComponent, RouterModule],
  templateUrl: './list-person.component.html',
  styleUrl: './list-person.component.css'
})
export class ListPersonComponent implements OnInit {
  listPerson$!: Observable<PersonList[]>;


  constructor(private apiService: ApiService<PersonCreate, PersonList>) { }

  ngOnInit(): void {
    this.listPerson$ = this.apiService.ObtenerTodo('Person')
  }


  displayedColumns: string[] = ['firstName', 'documentNumber', 'documentTypeName', 'bloodTypeName', 'cityName', 'isDeleted', 'actions'];


  save() { }
  delete(item: any) { }
  toggleIsActive(item: any) { }
}
