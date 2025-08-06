import { Component, OnInit, signal } from '@angular/core';
import { GenericTableComponent } from "../../../../../shared/components/generic-table/generic-table.component";
import { ApiService } from '../../../../../core/Services/api/api.service';
import { Role } from '../../../../../core/Models/security/role.models';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-roles',
  imports: [
    CommonModule,
    GenericTableComponent],
  templateUrl: './list-roles.component.html',
  styleUrl: './list-roles.component.css'
})
export class ListRolesComponent implements OnInit {
  listRoles$!: Observable<Role[]>;

  constructor(private apiService: ApiService<Role, Role>) { }

  ngOnInit(): void {
    this.listRoles$ = this.apiService.ObtenerTodo('Rol')
  }

  displayedColumns: string[] = ['name', 'description', 'isDeleted', 'actions'];


  save() { }
  delete(item: any) { }
  toggleIsActive(item: any) { }
}
