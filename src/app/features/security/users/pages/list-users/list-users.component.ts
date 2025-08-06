import { Component, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { GenericTableComponent } from "../../../../../shared/components/generic-table/generic-table.component";
import { ApiService } from '../../../../../core/Services/api/api.service';
import {MatChipsModule} from '@angular/material/chips';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-users',
  imports: [
    CommonModule,
    GenericTableComponent,
    MatChipsModule
  ],
  templateUrl: './list-users.component.html',
  styleUrl: './list-users.component.css',
  encapsulation: ViewEncapsulation.None
})
export class ListUsersComponent {
  constructor(private apiService: ApiService) { }
 items: any[] = [];

  ngOnInit(): void {
    this.apiService.ObtenerTodo('User').subscribe(user => {
      this.items = user;
    })
  }


  displayedColumns: string[] = ['namePerson', 'email', 'roles', 'isDeleted', 'actions'];


  save() { }
  delete(item: any) { }
  toggleIsActive(item: any) { }
}
