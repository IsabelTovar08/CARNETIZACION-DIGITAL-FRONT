import { Component, OnInit, signal } from '@angular/core';
import { GenericTableComponent } from "../../../../../shared/components/generic-table/generic-table.component";
import { ApiService } from '../../../../../core/Services/api/api.service';
import { Form } from '@angular/forms';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-forms',
  imports: [
    CommonModule,
    GenericTableComponent],
  templateUrl: './list-forms.component.html',
  styleUrl: './list-forms.component.css'
})
export class ListFormsComponent implements OnInit {
  listForms$!: Observable<Form[]>;

  constructor(private apiService: ApiService<Form, Form>) { }

  ngOnInit(): void {
    this.listForms$ = this.apiService.ObtenerTodo('Form');
  }

  displayedColumns: string[] = ['name', 'description', 'isDeleted', 'actions'];


  save() { }
  delete(item: any) { }
  toggleIsActive(item: any) { }
}
