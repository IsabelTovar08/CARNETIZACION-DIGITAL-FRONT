import { Component, ChangeDetectionStrategy, ViewEncapsulation, OnInit, signal } from '@angular/core';
import { GenericTableComponent } from "../../../../../shared/components/generic-table/generic-table.component";
import { ApiService } from '../../../../../core/Services/api/api.service';
import {MatChipsModule} from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { UserCreate, UserList } from '../../../../../core/Models/security/user.models';
import { Observable } from 'rxjs';

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
export class ListUsersComponent implements OnInit{
  listUser$!: Observable<UserCreate[]>;

  constructor(private apiService: ApiService<UserCreate, UserList>) { }

  ngOnInit(): void {
    this.listUser$ = this.apiService.ObtenerTodo('User')
  }


  displayedColumns: string[] = ['namePerson', 'email', 'roles', 'isDeleted', 'actions'];


  save() { }
  delete(item: any) { }
  toggleIsActive(item: any) { }
}
